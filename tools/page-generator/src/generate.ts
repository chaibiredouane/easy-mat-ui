import { renderCardGrid, renderChipNav, renderLanguageSwitch, renderPageHeader, renderSegmented, renderStat } from './blocks';
import { STANDARD_TRANSLATIONS } from './catalog';
import { Ctx } from './context';
import { isIdentifier, kebab, pascal } from './naming';
import { renderTable } from './table';
import { Block, GeneratedFile, GenerationResult, ModelSpec, PageConfig } from './types';

const DEFAULT_LIB = 'easy-mat-ui';

function validateModel(model: ModelSpec, where: string): void {
  if (!isIdentifier(model.className)) throw new Error(`${where}: "${model.className}" is not a valid class name.`);
  if (!model.fields.length) throw new Error(`${where}: the model ${model.className} has no field.`);
  const seen = new Set<string>();
  for (const field of model.fields) {
    if (!isIdentifier(field.name)) throw new Error(`${where}: "${field.name}" is not a valid field name.`);
    if (seen.has(field.name)) throw new Error(`${where}: the field "${field.name}" is listed twice.`);
    seen.add(field.name);
  }
  if (!model.generate && !model.importPath) throw new Error(`${where}: an existing model needs its import path.`);
}

/** Throws a readable error when the configuration cannot produce a page. */
export function validatePage(config: PageConfig): void {
  const name = kebab(config.name);
  if (!/^[a-z][a-z0-9-]*$/.test(name)) throw new Error(`The page name "${config.name}" must start with a letter and use letters, digits and hyphens.`);
  if (!config.blocks.length) throw new Error('Choose at least one component for the page.');
  if (config.blocks.filter((block) => block.type === 'table').length > 1) throw new Error('A page can have only one table.');
  for (const block of config.blocks) {
    const ids = (list: { id?: string }[]) => list.map((item) => item.id).filter(Boolean);
    const unique = (list: unknown[], what: string) => {
      if (new Set(list).size !== list.length) throw new Error(`${what}: ids must be different.`);
    };
    switch (block.type) {
      case 'chip-nav':
        if (!block.items.length) throw new Error('The category buttons need at least one item.');
        unique(ids(block.items), 'Category buttons');
        break;
      case 'segmented':
        if (!block.options.length) throw new Error('The segmented control needs at least one option.');
        unique(ids(block.options), 'Segmented control');
        break;
      case 'language-switch':
        if (!block.languages.length) throw new Error('The language picker needs at least one language.');
        unique(block.languages.map((language) => language.code), 'Language picker');
        break;
      case 'card-grid':
        if (!block.cards.length) throw new Error('The card grid needs at least one card.');
        unique(ids(block.cards), 'Card grid');
        break;
      case 'table':
        validateModel(block.model, 'Table');
        if (block.child) validateModel(block.child.model, 'Child table');
        break;
      default:
        break;
    }
  }
}

const indentBlock = (text: string, spaces: number): string =>
  text
    .split('\n')
    .map((line) => (line ? ' '.repeat(spaces) + line : line))
    .join('\n');

/** Turns a page described as data into the files of an Angular component. Pure: it reads and writes nothing. */
export function generatePage(config: PageConfig): GenerationResult {
  validatePage(config);
  const name = kebab(config.name);
  const lib = config.libPackage || DEFAULT_LIB;
  const root = config.i18nRoot || 'PAGES';
  const ctx = new Ctx(name.toUpperCase().replace(/-/g, '_'), config.i18n, root, lib);

  const html: string[] = [];
  const files: GeneratedFile[] = [];
  const topLevel: string[] = [];
  const modelClassNames: string[] = [];
  let hasTable = false;

  const render = (block: Block): string => {
    switch (block.type) {
      case 'page-header':
        return renderPageHeader(ctx, block);
      case 'stat':
        return renderStat(ctx, block);
      case 'chip-nav':
        return renderChipNav(ctx, block);
      case 'segmented':
        return renderSegmented(ctx, block);
      case 'language-switch':
        return renderLanguageSwitch(ctx, block);
      case 'card-grid':
        return renderCardGrid(ctx, block);
      case 'table': {
        hasTable = true;
        const table = renderTable(ctx, block, name);
        files.push(table.configFile, ...table.modelFiles);
        topLevel.push(...table.topLevel);
        modelClassNames.push(...table.modelClassNames);
        return table.html;
      }
    }
  };
  for (const block of config.blocks) html.push(render(block));

  // A class named like a model would hide it: add "Page".
  const base = pascal(name);
  const className = modelClassNames.includes(base) ? `${base}Page` : base;

  // ---- infrastructure that the blocks asked for ---------------------------------------------------------------------
  if (ctx.needsTranslateService) {
    ctx.imports.add('@angular/core', 'inject');
    ctx.imports.add('@ngx-translate/core', 'TranslateService');
    ctx.infrastructure.push('private readonly translate = inject(TranslateService);');
  }
  if (ctx.usesInstant) {
    ctx.imports.add('@angular/core/rxjs-interop', 'toSignal');
    ctx.imports.add('rxjs', 'map');
    ctx.infrastructure.push(
      '/** Changes with the language: the values that read it are evaluated again. */\nprivate readonly lang = toSignal(this.translate.onLangChange.pipe(map((event) => event.lang)), {\n  initialValue: this.translate.currentLang\n});'
    );
  }
  if (ctx.usesPipe) {
    ctx.imports.add('@ngx-translate/core', 'TranslatePipe');
    ctx.componentImports.add('TranslatePipe');
  }
  ctx.imports.add('@angular/core', 'Component');

  // ---- the component ---------------------------------------------------------------------------------------------------
  const componentImports = [...ctx.componentImports].sort((a, b) => a.localeCompare(b));
  const importsList = componentImports.length > 3 ? `[\n${indentBlock(componentImports.join(',\n'), 4)}\n  ]` : `[${componentImports.join(', ')}]`;
  const styles = [':host { display: grid; gap: 16px; }', ...ctx.styles];
  const members = [...ctx.infrastructure, ...ctx.members];
  const prefix = config.selectorPrefix || 'app';

  const component = [
    ctx.imports.render(),
    '',
    ...(topLevel.length ? [topLevel.join('\n\n'), ''] : []),
    '@Component({',
    `  selector: '${prefix}-${name}',`,
    `  imports: ${importsList},`,
    `  templateUrl: './${name}.html',`,
    `  styles: \`\n${indentBlock(styles.join('\n'), 4)}\n  \``,
    '})',
    `export class ${className} {`,
    members.length ? indentBlock(members.join('\n\n'), 2) : '',
    '}',
    ''
  ].join('\n');

  files.unshift(
    { path: `${name}.ts`, role: 'component', content: component },
    { path: `${name}.html`, role: 'template', content: `${html.join('\n\n')}\n` }
  );

  // ---- notes for the developer -------------------------------------------------------------------------------------
  const warnings: string[] = [];
  if (hasTable && !config.i18n) {
    warnings.push('The table of easy-mat-ui reads its labels through ngx-translate: keep provideTranslateService() in your application config (no dictionary is needed).');
  }
  if (hasTable) {
    warnings.push('Add provideEasyPaginatorIntl() to your providers if you want the paginator to follow your language.');
  }
  if (config.blocks.some((block) => block.type === 'language-switch' && block.languages.some((language) => language.flag))) {
    warnings.push('Flags use the flag-icons stylesheet: npm install flag-icons, then add "node_modules/flag-icons/css/flag-icons.min.css" to the styles of angular.json.');
  }
  const table = config.blocks.find((block) => block.type === 'table');
  if (table?.type === 'table' && table.model.generate) {
    // The generic model has fields named item1, item2...; a model written by the developer does not.
    warnings.push(
      table.model.fields.some((field) => /^item\d+$/.test(field.name))
        ? 'The model and the rows are placeholders (item1, item2...): rename them, or point the table to your own model.'
        : 'The rows are example data: replace them with your own data. The model file was generated from the fields you gave.'
    );
  }

  return {
    className,
    selector: `${prefix}-${name}`,
    files,
    translations: config.i18n ? { ...ctx.translations } : {},
    standardTranslations: config.i18n && hasTable ? { ...STANDARD_TRANSLATIONS } : {},
    warnings
  };
}
