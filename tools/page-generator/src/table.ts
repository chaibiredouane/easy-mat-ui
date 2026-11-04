import { Ctx } from './context';
import { camel, constant, label, quote } from './naming';
import { GeneratedFile, ModelField, ModelSpec, TableBlock } from './types';

/*
 * The table block: a configuration file (columns, dialog, table), the models that do not exist yet, example rows,
 * and the members of the component that keep the rows and react to the dialog. The rows live in memory: replace those
 * lines with calls to your service when the data comes from an API.
 */

export interface TableOutput {
  html: string;
  configFile: GeneratedFile;
  modelFiles: GeneratedFile[];
  /** Constants placed before the component (the example rows). */
  topLevel: string[];
  /** Class names the component must not take for itself. */
  modelClassNames: string[];
}

const keyFieldOf = (model: ModelSpec): ModelField => model.fields.find((f) => f.name === 'id') ?? model.fields[0];

/** The link from a child row to its parent, when the model has one. */
const parentLinkOf = (model: ModelSpec): ModelField | undefined => model.fields.find((f) => f.name === 'parentId');

const isShown = (model: ModelSpec, field: ModelField, isChild: boolean): boolean =>
  field.name !== keyFieldOf(model).name && !(isChild && field.name === 'parentId');

const defaultValue = (field: ModelField): string => {
  switch (field.type) {
    case 'string':
      return "''";
    case 'number':
      return '0';
    case 'boolean':
      return 'false';
    case 'date':
      return 'null';
  }
};

const typeOf = (field: ModelField): string => (field.type === 'date' ? 'Date | null' : field.type);

/** A model file: a class whose properties have a default value, so `new Item()` is an empty row. */
function modelFile(model: ModelSpec): GeneratedFile {
  const lines = model.fields.map((field) =>
    field.type === 'date' ? `  ${field.name}: ${typeOf(field)} = null;` : `  ${field.name} = ${defaultValue(field)};`
  );
  return { path: `${model.fileBase}.model.ts`, role: 'model', content: `export class ${model.className} {\n${lines.join('\n')}\n}\n` };
}

/** Example rows, so the page shows something as soon as it is generated. */
function sampleRows(model: ModelSpec, name: string, count: number, parentCount: number, isChild: boolean): string {
  const keyName = keyFieldOf(model).name;
  const rows = Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    const properties = model.fields.map((field) => {
      if (field.name === keyName) return `${field.name}: ${field.type === 'number' ? n : quote(String(n))}`;
      if (isChild && field.name === 'parentId') return `${field.name}: ${(i % Math.max(1, parentCount)) + 1}`;
      switch (field.type) {
        case 'string':
          return `${field.name}: ${quote(`${field.name} ${n}`)}`;
        case 'number':
          return `${field.name}: ${n * 10}`;
        case 'boolean':
          return `${field.name}: ${n % 2 === 1}`;
        case 'date':
          return `${field.name}: new Date(2026, 0, ${n})`;
      }
    });
    return `  { ${properties.join(', ')} }`;
  });
  // Properties that are left out would be missing from the rows: the cast says that it is intended.
  const cast = model.ignored?.length ? ` as ${model.className}[]` : '';
  return `const ${name}: ${model.className}[] = [\n${rows.join(',\n')}\n]${cast};`;
}

/** `PAGES.STOCK.` for the labels of the columns and of the dialog (the dialog reads `prefix + name`). */
const prefixOf = (ctx: Ctx): string => (ctx.i18n ? `${ctx.root}.${ctx.pageConstant}.` : '');

/** The text of a column title or a toolbar: a key of the translation file, or the text itself. */
function columnTitle(ctx: Ctx, field: ModelField): string {
  if (!ctx.i18n) return quote(label(field.name));
  ctx.translations[`${prefixOf(ctx)}${field.name}`] = label(field.name);
  return `t(${quote(field.name)})`;
}

interface Side {
  model: ModelSpec;
  isChild: boolean;
  title: string;
}

/** Columns, dialog and table of one model, as three exported functions. */
function sideCode(ctx: Ctx, block: TableBlock, side: Side, hasChild: boolean): string {
  const { model, isChild } = side;
  const base = camel(model.className);
  const filters = block.filters !== false && !isChild;
  const shown = model.fields.filter((field) => isShown(model, field, isChild));
  const firstText = shown.find((field) => field.type === 'string') ?? shown[0];
  let filtered = 0;

  const columns = shown.map((field) => {
    const title = columnTitle(ctx, field);
    if (field.type === 'boolean') {
      return `    new MatColumnTyped({
      name: ${quote(field.name)},
      type: ColumnType.ICON,
      translateTitle: ${title},
      enableIcon: 'check_circle',
      disableIcon: 'cancel',
      stickyClass: 'text-center',
      conditionFn: (item: ${model.className}) => !!item.${field.name},
      cssClassFn: (item: ${model.className}) => (item.${field.name} ? 'text-success' : 'text-danger')
    })`;
    }
    const properties = [`name: ${quote(field.name)}`, `translateTitle: ${title}`];
    if (field.type === 'date') properties.push('type: ColumnType.DATE');
    if (filters && field.type === 'string' && filtered < 2) {
      properties.push("enableFilter: true, filterType: 'text'");
      filtered++;
    }
    return `    new MatColumnTyped({ ${properties.join(', ')} })`;
  });
  columns.push("    new MatColumnTyped({ name: 'actions', headerIcon: 'rule', stickyClass: 'text-center' })");

  const dialogFields = shown.map((field, index) => {
    const inputType = field.type === 'boolean' ? 'Checkbox' : field.type === 'number' ? 'Number' : field.type === 'date' ? 'Date' : undefined;
    const properties = [`name: ${quote(field.name)}`, `order: ${index + 1}`];
    if (field === firstText) properties.push('isRequired: true');
    if (inputType) properties.push(`inputType: InputType.${inputType}`);
    return `    new MatColumnTyped({ ${properties.join(', ')} })`;
  });

  const empty = model.fields.map((field) => `${field.name}: ${defaultValue(field)}`).join(', ');
  const entityKey = isChild ? 'CHILD_ENTITY' : 'ENTITY';
  const entityText = isChild ? 'Sub-item' : 'Item';
  let dialogTitle: string;
  if (ctx.i18n) {
    ctx.translations[`${prefixOf(ctx)}${entityKey}`] = label(model.className) || entityText;
    dialogTitle = quote(`${prefixOf(ctx)}${entityKey}`);
  } else {
    dialogTitle = quote(label(model.className) || entityText);
  }

  const canCreate = block.canCreate !== false;
  const canUpdate = block.canUpdate !== false;
  const canDelete = block.canDelete !== false;
  const pageSize = isChild ? 5 : block.pageSize ?? 10;
  const tableProperties = [
    "    appearance: 'outline'",
    '    withToolbar: true',
    `    withFilterInHeader: ${filters}`,
    ...(!isChild && hasChild ? ['    isExpanded: true'] : []),
    `    changePageSize: ${pageSize}`,
    "    sortedBy: ''",
    `    canCreate: ${canCreate}`,
    `    canUpdate: ${canUpdate}`,
    `    canDelete: ${canDelete}`,
    '    prefix: PREFIX',
    `    displayedColumns: ${base}Columns()`,
    `    toolbarConfig: new ToolbarConfig({ icon: ${quote(block.icon ?? 'grid_view')}, translations: new ToolbarTranslations({ title: ctx.title }) })`,
    '    data: ctx.data',
    `    dialog: { add: ${canCreate}, edit: ${canUpdate}, view: true, mode: 'open', form: ${base}DialogForm }`
  ];

  return `export function ${base}Columns(): MatColumnTyped[] {
  return [
${columns.join(',\n')}
  ];
}

export function ${base}DialogFields(): MatColumnTyped[] {
  return [
${dialogFields.join(',\n')}
  ];
}

export function ${base}DialogForm(request: EasyTableDialogRequest<${model.className}>): EasyDialogInit<${model.className}> {
  return {
    title: ${dialogTitle},
    titleField: ${quote(firstText?.name ?? keyFieldOf(model).name)},
    action: request.action,
    data: request.action === CRUD.CREATE ? ({ ${empty} } as ${model.className}) : request.data,
    fields: ${base}DialogFields(),
    prefix: PREFIX,
    withAuditFields: false
  };
}

export interface ${model.className}TableCtx {
  data: ${model.className}[];
  /** Title of the toolbar, already translated. */
  title: string;
}

export function ${base}Table(ctx: ${model.className}TableCtx): EasyTableConfig<${model.className}> {
  return new EasyTableConfig<${model.className}>({
${tableProperties.join(',\n')}
  });
}`;
}

export function renderTable(ctx: Ctx, block: TableBlock, pageName: string): TableOutput {
  const sides: Side[] = [{ model: block.model, isChild: false, title: block.title }];
  if (block.child) sides.push({ model: block.child.model, isChild: true, title: block.child.title ?? `${block.title} details` });
  const hasChild = sides.length > 1;
  const configName = `${pageName}.config`;

  // ---- configuration file --------------------------------------------------------------------------------------
  const imports = new Map<string, Set<string>>();
  const need = (from: string, ...names: string[]) => {
    const set = imports.get(from) ?? new Set<string>();
    names.forEach((n) => set.add(n));
    imports.set(from, set);
  };
  const code = sides.map((side) => sideCode(ctx, block, side, hasChild)).join('\n\n');
  // Only what the generated code really uses is imported.
  for (const name of ['ColumnType', 'CRUD', 'EasyDialogInit', 'EasyTableConfig', 'EasyTableDialogRequest', 'MatColumnTyped', 'ToolbarConfig', 'ToolbarTranslations']) {
    if (new RegExp(`\\b${name}\\b`).test(code)) need(ctx.lib, name);
  }
  for (const side of sides) {
    need(side.model.generate ? `./${side.model.fileBase}.model` : side.model.importPath ?? `./${side.model.fileBase}.model`, side.model.className);
  }
  const importLines = [...imports.entries()]
    .sort(([a], [b]) => Number(a.startsWith('.')) - Number(b.startsWith('.')) || a.localeCompare(b))
    .map(([from, names]) => `import { ${[...names].sort((a, b) => a.localeCompare(b)).join(', ')} } from '${from}';`)
    .join('\n');
  const header = [
    importLines,
    '',
    ...(/InputType\./.test(code) ? ['const { InputType } = MatColumnTyped;'] : []),
    // The dialog reads `prefix + name` for the label of each field, and the columns read `translateTitle`.
    `const PREFIX = ${quote(prefixOf(ctx))};`,
    ...(ctx.i18n ? ['const t = (key: string) => PREFIX + key;'] : [])
  ].join('\n');
  const configFile: GeneratedFile = { path: `${configName}.ts`, role: 'config', content: `${header}\n\n${code}\n` };

  // ---- models and example rows -------------------------------------------------------------------------------------
  const modelFiles = sides.filter((s) => s.model.generate).map((s) => modelFile(s.model));
  const topLevel: string[] = [];
  const parentRows = 6;
  const sampleName = (model: ModelSpec) => `SAMPLE_${constant(model.className)}S`;
  topLevel.push(sampleRows(block.model, sampleName(block.model), parentRows, 0, false));
  if (block.child) topLevel.push(sampleRows(block.child.model, sampleName(block.child.model), 10, parentRows, true));

  // ---- members of the component ------------------------------------------------------------------------------------
  const parent = block.model;
  const parentKey = keyFieldOf(parent).name;
  const parentBase = camel(parent.className);
  ctx.imports.add('@angular/core', 'computed', 'signal');
  ctx.useComponent('EasyTableComponent');
  ctx.useLib('CRUD', 'EasyTableDialogResult');
  ctx.imports.add(`./${configName}`, ...sides.map((s) => `${camel(s.model.className)}Table`));
  for (const side of sides) {
    ctx.imports.add(side.model.generate ? `./${side.model.fileBase}.model` : side.model.importPath ?? `./${side.model.fileBase}.model`, side.model.className);
  }

  const canCreate = block.canCreate !== false;
  const canUpdate = block.canUpdate !== false;
  const canDelete = block.canDelete !== false;
  const reads = ctx.i18n ? '  this.lang();\n' : '';
  const title = (suffix: string, text: string) => ctx.ts(suffix, text);

  const nextKey = (rowsVar: string, model: ModelSpec) => {
    const key = keyFieldOf(model);
    return key.type === 'number'
      ? `Math.max(0, ...${rowsVar}.map((row) => row.${key.name})) + 1`
      : `String(Date.now())`;
  };

  ctx.members.push(`readonly rows = signal<${parent.className}[]>(${sampleName(parent)});`);
  ctx.members.push(
    `readonly tableConfig = computed(() => {\n${reads}  return ${parentBase}Table({ data: this.rows(), title: ${title('TABLE_TITLE', block.title)} });\n});`
  );

  if (canCreate || canUpdate) {
    ctx.members.push(`onDialogResult({ result }: EasyTableDialogResult<${parent.className}>): void {
  if (result.event !== CRUD.CREATE && result.event !== CRUD.UPDATE) return;
  const saved = result.data as ${parent.className};
  // Replace the next lines with a call to your service when the data comes from an API.
  this.rows.update((rows) =>
    rows.some((row) => row.${parentKey} === saved.${parentKey})
      ? rows.map((row) => (row.${parentKey} === saved.${parentKey} ? saved : row))
      : [...rows, { ...saved, ${parentKey}: ${nextKey('rows', parent)} }]
  );
}`);
  }
  if (canDelete) {
    ctx.members.push(`onDelete(item: object): void {
  const { ${parentKey} } = item as ${parent.className};
  // Replace the next line with a call to your service when the data comes from an API.
  this.rows.update((rows) => rows.filter((row) => row.${parentKey} !== ${parentKey}));
}`);
  }

  if (block.child) {
    const child = block.child.model;
    const childKey = keyFieldOf(child).name;
    const childBase = camel(child.className);
    const link = parentLinkOf(child);
    const childTitle = block.child.title ?? `${block.title} details`;
    ctx.members.push(`private readonly allChildRows = signal<${child.className}[]>(${sampleName(child)});`);
    ctx.members.push(`private readonly currentParent = signal<${parent.className} | null>(null);`);
    ctx.members.push(
      link
        ? `readonly childRows = computed(() => {\n  const parent = this.currentParent();\n  return this.allChildRows().filter((row) => row.${link.name} === parent?.${parentKey});\n});`
        : `// The rows of the child table. Filter them by the row that is open (this.currentParent()).\nreadonly childRows = computed(() => this.allChildRows());`
    );
    ctx.members.push(
      `readonly childConfig = computed(() => {\n${reads}  return ${childBase}Table({ data: this.childRows(), title: ${title('CHILD_TITLE', childTitle)} });\n});`
    );
    ctx.members.push(`onExtendRow(parent: ${parent.className} | null): void {\n  this.currentParent.set(parent);\n}`);
    if (canCreate || canUpdate) {
      ctx.members.push(`onChildDialogResult({ result }: EasyTableDialogResult<${child.className}>): void {
  if (result.event !== CRUD.CREATE && result.event !== CRUD.UPDATE) return;
  const saved = result.data as ${child.className};
  // Replace the next lines with a call to your service when the data comes from an API.
  this.allChildRows.update((rows) =>
    rows.some((row) => row.${childKey} === saved.${childKey})
      ? rows.map((row) => (row.${childKey} === saved.${childKey} ? saved : row))
      : [...rows, { ...saved, ${childKey}: ${nextKey('rows', child)}${link ? `, ${link.name}: this.currentParent()?.${parentKey} ?? saved.${link.name}` : ''} }]
  );
}`);
    }
    if (canDelete) {
      ctx.members.push(`onDeleteChild(item: object): void {
  const { ${childKey} } = item as ${child.className};
  // Replace the next line with a call to your service when the data comes from an API.
  this.allChildRows.update((rows) => rows.filter((row) => row.${childKey} !== ${childKey}));
}`);
    }
  }

  // ---- template ------------------------------------------------------------------------------------------------------
  const bindings = [
    '[config]="tableConfig()"',
    block.child ? '[childConfig]="childConfig()"' : '',
    canCreate || canUpdate ? '(dialogResult)="onDialogResult($event)"' : '',
    canDelete ? '(deleteItem)="onDelete($event)"' : '',
    block.child ? '(extendRow)="onExtendRow($event)"' : '',
    block.child && (canCreate || canUpdate) ? '(childDialogResult)="onChildDialogResult($event)"' : '',
    block.child && canDelete ? '(deleteChildItem)="onDeleteChild($event)"' : ''
  ].filter(Boolean);
  const html = `<lib-easy-table\n  ${bindings.join('\n  ')} />`;

  return { html, configFile, modelFiles, topLevel, modelClassNames: sides.map((s) => s.model.className) };
}
