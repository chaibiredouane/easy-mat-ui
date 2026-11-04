import { Ctx, keyOf } from './context';
import { isIdentifier, quote } from './naming';
import { CardGridBlock, ChipNavBlock, LanguageSwitchBlock, PageHeaderBlock, SegmentedBlock, StatBlock } from './types';

/*
 * Every block returns its HTML and adds what it needs to the context: imports, members of the component, styles.
 * Members are written without a base indentation: the assembler indents them once, inside the class.
 */

/** Properties of an object literal, written on one line; the ones without a value are left out. */
const object = (properties: (string | undefined)[]): string => `{ ${properties.filter(Boolean).join(', ')} }`;
const value = (v: string | number): string => (typeof v === 'number' ? String(v) : quote(v));
const capitalized = (name: string): string => name.charAt(0).toUpperCase() + name.slice(1);
const indent = (rows: string[], spaces: number): string => rows.map((row) => ' '.repeat(spaces) + row).join(',\n');

/**
 * A list of objects as a member. With translations the labels are read by the `TranslateService`, so the list is a
 * `computed` that reads the language and is evaluated again when it changes. Without, it is a plain array.
 */
function listMember(ctx: Ctx, name: string, type: string, rows: string[]): { member: string; call: string } {
  ctx.useLib(type);
  if (ctx.i18n) {
    ctx.usesInstant = true;
    ctx.needsTranslateService = true;
    ctx.imports.add('@angular/core', 'computed');
    return { member: `readonly ${name} = computed<${type}[]>(() => {\n  this.lang();\n  return [\n${indent(rows, 4)}\n  ];\n});`, call: '()' };
  }
  return { member: `readonly ${name}: ${type}[] = [\n${indent(rows, 2)}\n];`, call: '' };
}

export function renderPageHeader(ctx: Ctx, block: PageHeaderBlock): string {
  const v = keyOf(ctx.varName('header'));
  ctx.useComponent('EasyPageHeader');
  const properties = [
    block.icon ? `icon: ${quote(block.icon)}` : undefined,
    `title: ${ctx.tpl(`${v}_TITLE`, block.title)}`,
    block.subtitle ? `subtitle: ${ctx.tpl(`${v}_SUBTITLE`, block.subtitle)}` : undefined
  ];
  return `<lib-easy-page-header [config]="${object(properties)}" />`;
}

export function renderStat(ctx: Ctx, block: StatBlock): string {
  const v = keyOf(ctx.varName('stats'));
  ctx.useComponent('EasyStat');
  ctx.styles.add('.stats { display: flex; flex-wrap: wrap; gap: 12px; }');
  const stats = block.stats.map((stat, i) => {
    const properties = [
      `label: ${ctx.tpl(`${v}_${i + 1}_LABEL`, stat.label)}`,
      `value: ${value(stat.value)}`,
      stat.icon ? `icon: ${quote(stat.icon)}` : undefined,
      stat.tone ? `tone: ${quote(stat.tone)}` : undefined,
      stat.hint ? `hint: ${ctx.tpl(`${v}_${i + 1}_HINT`, stat.hint)}` : undefined
    ];
    return `  <lib-easy-stat [config]="${object(properties)}" />`;
  });
  return `<div class="stats">\n${stats.join('\n')}\n</div>`;
}

export function renderChipNav(ctx: Ctx, block: ChipNavBlock): string {
  const name = ctx.varName('nav');
  const v = keyOf(name);
  ctx.useComponent('EasyChipNav');
  ctx.imports.add('@angular/core', 'signal');
  const rows = block.items.map((item) =>
    object([
      `id: ${quote(item.id)}`,
      `label: ${ctx.ts(`${v}_ITEM_${keyOf(item.id)}`, item.label)}`,
      item.icon ? `icon: ${quote(item.icon)}` : undefined,
      item.color ? `color: ${quote(item.color)}` : undefined,
      item.count !== undefined ? `count: ${item.count}` : undefined
    ])
  );
  const list = listMember(ctx, `${name}Items`, 'EasyChipNavItem', rows);
  ctx.members.push(list.member, `readonly ${name}Selected = signal(${quote(block.selected ?? block.items[0]?.id ?? '')});`);
  return `<lib-easy-chip-nav
  [items]="${name}Items${list.call}"
  [selected]="${name}Selected()"
  ${ctx.attr('ariaLabel', `${v}_ARIA`, block.ariaLabel)}
  (selectedChange)="${name}Selected.set($event)" />`;
}

export function renderSegmented(ctx: Ctx, block: SegmentedBlock): string {
  const name = ctx.varName('segmented');
  const v = keyOf(name);
  ctx.useComponent('EasySegmented');
  ctx.imports.add('@angular/core', 'signal');
  const rows = block.options.map((option) =>
    object([
      `id: ${quote(option.id)}`,
      option.label ? `label: ${ctx.ts(`${v}_OPTION_${keyOf(option.id)}`, option.label)}` : undefined,
      option.icon ? `icon: ${quote(option.icon)}` : undefined,
      option.hint ? `hint: ${ctx.ts(`${v}_HINT_${keyOf(option.id)}`, option.hint)}` : undefined
    ])
  );
  const list = listMember(ctx, `${name}Options`, 'EasySegmentedOption', rows);
  ctx.members.push(list.member, `readonly ${name}Selected = signal(${quote(block.selected ?? block.options[0]?.id ?? '')});`);
  const extra = [block.iconOnly ? '[iconOnly]="true"' : '', block.size && block.size !== 'md' ? `size="${block.size}"` : ''].filter(Boolean);
  return `<lib-easy-segmented
  [options]="${name}Options${list.call}"
  [selected]="${name}Selected()"
  ${ctx.attr('ariaLabel', `${v}_ARIA`, block.ariaLabel)}${extra.map((e) => `\n  ${e}`).join('')}
  (selectedChange)="${name}Selected.set($event)" />`;
}

export function renderLanguageSwitch(ctx: Ctx, block: LanguageSwitchBlock): string {
  const name = ctx.varName('languages');
  const v = keyOf(name);
  const handler = `on${capitalized(name)}`;
  ctx.useComponent('EasyLanguageSwitch');
  ctx.useLib('EasyLanguage');
  ctx.imports.add('@angular/core', 'signal');
  // The names of the languages are written in their own language: they are never translated.
  const rows = block.languages.map((language) =>
    object([`code: ${quote(language.code)}`, `name: ${quote(language.name)}`, language.flag ? `flag: ${quote(language.flag)}` : undefined])
  );
  const first = block.selected ?? block.languages[0]?.code ?? 'en';
  if (ctx.i18n) ctx.needsTranslateService = true;
  const initial = ctx.i18n ? `this.translate.currentLang || ${quote(first)}` : quote(first);
  const change = ctx.i18n ? 'this.translate.use(code);' : '// Change the language of your application here.';
  ctx.members.push(
    `readonly ${name}: EasyLanguage[] = [\n${indent(rows, 2)}\n];`,
    `readonly ${name}Selected = signal(${initial});`,
    `${handler}(code: string): void {\n  this.${name}Selected.set(code);\n  ${change}\n}`
  );
  const extra = [
    block.layout && block.layout !== 'menu' ? `layout="${block.layout}"` : '',
    block.display && block.display !== 'flag-name' ? `display="${block.display}"` : ''
  ].filter(Boolean);
  return `<lib-easy-language-switch
  [languages]="${name}"
  [selected]="${name}Selected()"
  ${ctx.attr('ariaLabel', `${v}_ARIA`, block.ariaLabel)}${extra.map((e) => `\n  ${e}`).join('')}
  (selectedChange)="${handler}($event)" />`;
}

export function renderCardGrid(ctx: Ctx, block: CardGridBlock): string {
  const name = ctx.varName('cards');
  const v = keyOf(name);
  const handler = `on${capitalized(name)}Click`;
  ctx.useComponent('EasyCardGrid');
  const rows = block.cards.map((card, i) => {
    const id = card.id && isIdentifier(card.id) ? card.id : `card${i + 1}`;
    return object([
      `id: ${quote(id)}`,
      card.icon ? `icon: ${quote(card.icon)}` : undefined,
      `title: ${ctx.ts(`${v}_${keyOf(id)}_TITLE`, card.title)}`,
      card.description ? `description: ${ctx.ts(`${v}_${keyOf(id)}_DESCRIPTION`, card.description)}` : undefined,
      card.color ? `color: ${quote(card.color)}` : undefined,
      card.clickable ? 'clickable: true' : undefined,
      card.clickable && card.cta ? `cta: ${ctx.ts(`${v}_${keyOf(id)}_CTA`, card.cta)}` : undefined
    ]);
  });
  const list = listMember(ctx, name, 'EasyCardConfig', rows);
  ctx.members.push(list.member);
  const clickable = block.cards.some((card) => card.clickable);
  if (clickable) {
    ctx.members.push(`${handler}(card: EasyCardConfig): void {\n  // card.id tells which card was used.\n}`);
  }
  const attributes = [
    `[items]="${name}${list.call}"`,
    block.columns ? `[columns]="${block.columns}"` : '',
    block.minWidth ? `[minWidth]="${block.minWidth}"` : '',
    clickable ? `(cardClick)="${handler}($event)"` : ''
  ].filter(Boolean);
  return `<lib-easy-card-grid\n  ${attributes.join('\n  ')} />`;
}
