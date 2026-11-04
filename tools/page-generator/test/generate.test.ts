import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { defaultBlock, generatePage, genericChildModel, genericModel, kebab, pascal, singular, validatePage } from '../src';
import { GeneratedFile, GenerationResult, ModelSpec, PageConfig } from '../src/types';

const file = (result: GenerationResult, path: string): GeneratedFile => {
  const found = result.files.find((f) => f.path === path);
  assert.ok(found, `${path} should be generated (got ${result.files.map((f) => f.path).join(', ')})`);
  return found;
};

const page = (overrides: Partial<PageConfig> = {}): PageConfig => ({
  name: 'stock',
  i18n: false,
  blocks: [defaultBlock('page-header', 'stock'), defaultBlock('chip-nav', 'stock')],
  ...overrides
});

describe('names', () => {
  test('case conversions', () => {
    assert.equal(kebab('StockItems'), 'stock-items');
    assert.equal(pascal('stock-items'), 'StockItems');
    assert.equal(singular('stock-items-management'), 'stock-item');
    assert.equal(singular('categories'), 'category');
    assert.equal(singular('status'), 'status');
  });
});

describe('without translations', () => {
  const result = generatePage(page());
  const ts = file(result, 'stock.ts').content;
  const html = file(result, 'stock.html').content;

  test('writes plain texts and no translation code', () => {
    assert.match(html, /<lib-easy-page-header \[config\]="\{ icon: 'dashboard', title: 'Stock', subtitle: /);
    assert.match(html, /ariaLabel="Browse by category"/);
    assert.doesNotMatch(ts + html, /translate/i);
    assert.deepEqual(result.translations, {});
    assert.deepEqual(result.standardTranslations, {});
  });

  test('keeps the lists as plain arrays and the choice as a signal', () => {
    assert.match(ts, /readonly navItems: EasyChipNavItem\[\] = \[/);
    assert.match(ts, /readonly navSelected = signal\('all'\);/);
    assert.match(html, /\[items\]="navItems"/);
    assert.match(html, /\(selectedChange\)="navSelected\.set\(\$event\)"/);
  });

  test('imports what it uses from the library and from Angular', () => {
    assert.match(ts, /import \{ EasyChipNav, EasyChipNavItem, EasyPageHeader \} from 'easy-mat-ui-ng20';/);
    assert.match(ts, /import \{ Component, signal \} from '@angular\/core';/);
    assert.match(ts, /selector: 'app-stock'/);
    assert.match(ts, /imports: \[EasyChipNav, EasyPageHeader\]/);
    assert.match(ts, /export class Stock \{/);
  });
});

describe('with translations', () => {
  const result = generatePage(page({ i18n: true }));
  const ts = file(result, 'stock.ts').content;
  const html = file(result, 'stock.html').content;

  test('uses keys in the template and the translate pipe', () => {
    assert.match(html, /title: \('PAGES\.STOCK\.HEADER_TITLE' \| translate\)/);
    assert.match(html, /\[ariaLabel\]="'PAGES\.STOCK\.NAV_ARIA' \| translate"/);
    assert.match(ts, /TranslatePipe/);
  });

  test('computes the lists again when the language changes', () => {
    assert.match(ts, /private readonly translate = inject\(TranslateService\);/);
    assert.match(ts, /private readonly lang = toSignal\(this\.translate\.onLangChange/);
    assert.match(ts, /readonly navItems = computed<EasyChipNavItem\[\]>\(\(\) => \{\n {4}this\.lang\(\);/);
    assert.match(ts, /label: this\.translate\.instant\('PAGES\.STOCK\.NAV_ITEM_ALL'\)/);
    assert.match(html, /\[items\]="navItems\(\)"/);
  });

  test('lists every key with its English text', () => {
    assert.equal(result.translations['PAGES.STOCK.HEADER_TITLE'], 'Stock');
    assert.equal(result.translations['PAGES.STOCK.NAV_ITEM_CATEGORY_A'], 'Category A');
    assert.equal(result.translations['PAGES.STOCK.NAV_ARIA'], 'Browse by category');
    assert.deepEqual(result.standardTranslations, {}, 'no table, so no keys of the table');
  });
});

describe('table with a generic model', () => {
  const config = page({ blocks: [defaultBlock('table', 'stock')] });
  const result = generatePage(config);

  test('generates the component, the template, the configuration and the model', () => {
    assert.deepEqual(result.files.map((f) => f.path).sort(), ['item.model.ts', 'stock.config.ts', 'stock.html', 'stock.ts']);
  });

  test('the model is a class with defaults', () => {
    const model = file(result, 'item.model.ts').content;
    assert.match(model, /export class Item \{/);
    assert.match(model, /id = 0;/);
    assert.match(model, /item1 = '';/);
    assert.match(model, /active = false;/);
  });

  test('the configuration has text, icon and action columns, filters and the dialog', () => {
    const c = file(result, 'stock.config.ts').content;
    assert.match(c, /new MatColumnTyped\(\{ name: 'item1', translateTitle: 'Item1', enableFilter: true, filterType: 'text' \}\)/);
    assert.match(c, /type: ColumnType\.ICON/);
    assert.match(c, /name: 'actions', headerIcon: 'rule'/);
    assert.match(c, /export function itemDialogForm\(request: EasyTableDialogRequest<Item>\)/);
    assert.match(c, /dialog: \{ add: true, edit: true, view: true, mode: 'open', form: itemDialogForm \}/);
    assert.match(c, /import \{ Item \} from '\.\/item\.model';/);
    assert.match(c, /name: 'active', order: 4, inputType: InputType\.Checkbox/);
    assert.match(c, /const \{ InputType \} = MatColumnTyped;/);
    assert.match(c, /const PREFIX = '';/);
  });

  test('the component keeps the rows and reacts to the dialog and to deletion', () => {
    const ts = file(result, 'stock.ts').content;
    assert.match(ts, /const SAMPLE_ITEMS: Item\[\] = \[/);
    assert.match(ts, /readonly rows = signal<Item\[\]>\(SAMPLE_ITEMS\);/);
    assert.match(ts, /onDialogResult\(\{ result \}: EasyTableDialogResult<Item>\): void/);
    assert.match(ts, /onDelete\(item: object\): void/);
    assert.match(file(result, 'stock.html').content, /<lib-easy-table\n {2}\[config\]="tableConfig\(\)"\n {2}\(dialogResult\)="onDialogResult\(\$event\)"\n {2}\(deleteItem\)="onDelete\(\$event\)" \/>/);
  });

  test('warns about what the developer must know', () => {
    assert.ok(result.warnings.some((w) => /provideTranslateService/.test(w)));
    assert.ok(result.warnings.some((w) => /placeholders/.test(w)));
  });

  test('read-only table: no dialog handler, no delete handler', () => {
    const readonly = generatePage(page({ blocks: [{ ...defaultBlock('table', 'stock'), canCreate: false, canUpdate: false, canDelete: false } as PageConfig['blocks'][number]] }));
    const html = file(readonly, 'stock.html').content;
    assert.doesNotMatch(html, /dialogResult|deleteItem/);
    assert.doesNotMatch(file(readonly, 'stock.ts').content, /onDialogResult|onDelete/);
  });
});

describe('table with translations', () => {
  const result = generatePage(page({ i18n: true, blocks: [defaultBlock('table', 'stock-items')], name: 'stock-items' }));

  test('labels and dialog come from keys under the page', () => {
    const c = file(result, 'stock-items.config.ts').content;
    assert.match(c, /const PREFIX = 'PAGES\.STOCK_ITEMS\.';/);
    assert.match(c, /const t = \(key: string\) => PREFIX \+ key;/);
    assert.match(c, /translateTitle: t\('item1'\)/);
    assert.match(c, /title: 'PAGES\.STOCK_ITEMS\.ENTITY'/);
    assert.equal(result.translations['PAGES.STOCK_ITEMS.item1'], 'Item1');
    assert.equal(result.translations['PAGES.STOCK_ITEMS.TABLE_TITLE'], 'Stock Items');
  });

  test('adds the keys of the library for the table, to merge only when missing', () => {
    assert.equal(result.standardTranslations['SEARCH'], 'Search');
    assert.equal(result.standardTranslations['PAGINATOR.RANGE'], '{{start}} – {{end}} of {{length}}');
    assert.ok(!result.warnings.some((w) => /provideTranslateService/.test(w)), 'ngx-translate is already in use');
  });
});

describe('table with an existing model', () => {
  const existing: ModelSpec = {
    className: 'StockItem',
    fileBase: 'stock-item',
    generate: false,
    importPath: '../../models/stock-item.model',
    fields: [
      { name: 'id', type: 'number' },
      { name: 'name', type: 'string' },
      { name: 'quantity', type: 'number' },
      { name: 'received', type: 'date' },
      { name: 'isActive', type: 'boolean' }
    ]
  };
  const result = generatePage(page({ name: 'stock-items', blocks: [{ ...(defaultBlock('table', 'stock-items') as any), model: existing }] }));

  test('imports the model and does not generate it', () => {
    assert.deepEqual(result.files.map((f) => f.path).sort(), ['stock-items.config.ts', 'stock-items.html', 'stock-items.ts']);
    assert.match(file(result, 'stock-items.config.ts').content, /import \{ StockItem \} from '\.\.\/\.\.\/models\/stock-item\.model';/);
    assert.match(file(result, 'stock-items.ts').content, /import \{ StockItem \} from '\.\.\/\.\.\/models\/stock-item\.model';/);
  });

  test('chooses a column and an input for each type', () => {
    const c = file(result, 'stock-items.config.ts').content;
    assert.match(c, /name: 'received', translateTitle: 'Received', type: ColumnType\.DATE/);
    assert.match(c, /name: 'received', order: 3, inputType: InputType\.Date/);
    assert.match(c, /name: 'quantity', order: 2, inputType: InputType\.Number/);
    assert.match(c, /name: 'isActive', order: 4, inputType: InputType\.Checkbox/);
    assert.match(c, /const \{ InputType \} = MatColumnTyped;/);
  });

  test('example rows have a value of the right type for each field', () => {
    const ts = file(result, 'stock-items.ts').content;
    assert.match(ts, /\{ id: 1, name: 'name 1', quantity: 10, received: new Date\(2026, 0, 1\), isActive: true \}/);
  });
});

describe('existing model with properties that cannot be columns', () => {
  const model: ModelSpec = {
    className: 'StockItem',
    fileBase: 'stock-item',
    generate: false,
    importPath: './stock-item.model',
    fields: [
      { name: 'id', type: 'number' },
      { name: 'name', type: 'string' }
    ],
    ignored: ['tags']
  };
  const result = generatePage(page({ blocks: [{ ...(defaultBlock('table', 'stock') as any), model }] }));

  test('the example rows leave them out, and say so with a cast', () => {
    const ts = file(result, 'stock.ts').content;
    assert.match(ts, /const SAMPLE_STOCK_ITEMS: StockItem\[\] = \[\n {2}\{ id: 1, name: 'name 1' \}/);
    assert.match(ts, /\n\] as StockItem\[\];/);
  });

  test('a model that is fully supported has no cast', () => {
    assert.doesNotMatch(file(generatePage(page({ blocks: [defaultBlock('table', 'stock')] })), 'stock.ts').content, / as Item\[\]/);
  });
});

describe('long import lists', () => {
  test('go one name per line, short ones stay on one line', () => {
    const blocks = (['page-header', 'stat', 'chip-nav', 'segmented', 'language-switch', 'card-grid', 'table'] as const).map((type) => defaultBlock(type, 'x'));
    const ts = file(generatePage({ name: 'x', i18n: true, blocks }), 'x.ts').content;
    assert.match(ts, /import \{\n {2}CRUD,\n/);
    assert.match(ts, /\} from 'easy-mat-ui-ng20';/);
    assert.match(ts, /import \{ map \} from 'rxjs';/);
  });
});

describe('notes for the developer', () => {
  test('a generic model is said to be a placeholder, a model of the developer is not', () => {
    const own: ModelSpec = { className: 'Product', fileBase: 'product', generate: true, fields: [{ name: 'id', type: 'number' }, { name: 'name', type: 'string' }] };
    const generic = generatePage(page({ blocks: [defaultBlock('table', 'a')] }));
    const mine = generatePage(page({ blocks: [{ ...(defaultBlock('table', 'a') as any), model: own }] }));
    assert.ok(generic.warnings.some((w) => /placeholders \(item1/.test(w)));
    assert.ok(!mine.warnings.some((w) => /placeholders/.test(w)));
    assert.ok(mine.warnings.some((w) => /example data/.test(w)));
  });
});

describe('table with a child table', () => {
  const block = { ...(defaultBlock('table', 'stock') as any), child: { title: 'Details', model: genericChildModel() } };
  const result = generatePage(page({ blocks: [block] }));
  const ts = file(result, 'stock.ts').content;

  test('generates both models and opens the child under a row', () => {
    assert.ok(result.files.some((f) => f.path === 'sub-item.model.ts'));
    assert.match(file(result, 'stock.html').content, /\[childConfig\]="childConfig\(\)"/);
    assert.match(file(result, 'stock.html').content, /\(extendRow\)="onExtendRow\(\$event\)"/);
    assert.match(file(result, 'stock.config.ts').content, /isExpanded: true/);
  });

  test('keeps the rows of the open parent and gives new rows its id', () => {
    assert.match(ts, /\.filter\(\(row\) => row\.parentId === parent\?\.id\)/);
    assert.match(ts, /parentId: this\.currentParent\(\)\?\.id \?\? saved\.parentId/);
    assert.match(ts, /onExtendRow\(parent: Item \| null\): void/);
  });

  test('the link to the parent is neither a column nor a field of the dialog', () => {
    const c = file(result, 'stock.config.ts').content;
    const childPart = c.slice(c.indexOf('export function subItemColumns'));
    assert.doesNotMatch(childPart, /name: 'parentId'/);
  });
});

describe('every kind of component together', () => {
  const blocks = (['page-header', 'stat', 'chip-nav', 'segmented', 'language-switch', 'card-grid', 'table'] as const).map((type) => defaultBlock(type, 'dashboard'));
  for (const i18n of [false, true]) {
    test(`generates one coherent component (${i18n ? 'with' : 'without'} translations)`, () => {
      const result = generatePage({ name: 'dashboard', i18n, blocks });
      const ts = file(result, 'dashboard.ts').content;
      const html = file(result, 'dashboard.html').content;
      for (const selector of ['lib-easy-page-header', 'lib-easy-stat', 'lib-easy-chip-nav', 'lib-easy-segmented', 'lib-easy-language-switch', 'lib-easy-card-grid', 'lib-easy-table']) {
        assert.ok(html.includes(`<${selector}`), `${selector} in the template`);
      }
      for (const component of ['EasyPageHeader', 'EasyStat', 'EasyChipNav', 'EasySegmented', 'EasyLanguageSwitch', 'EasyCardGrid', 'EasyTableComponent']) {
        assert.match(ts, new RegExp(`imports: \\[[\\s\\S]*\\b${component}\\b[\\s\\S]*\\]`));
      }
      assert.equal(ts.includes('TranslatePipe'), i18n);
      assert.equal(/\bthis\.translate\b/.test(ts), i18n);
      // every `{{` or binding in the template refers to something the class has
      for (const name of ['navItems', 'navSelected', 'segmentedOptions', 'segmentedSelected', 'languages', 'languagesSelected', 'onLanguages', 'cards', 'onCardsClick', 'tableConfig']) {
        assert.ok(ts.includes(name), `${name} in the class`);
      }
    });
  }

  test('a second block of the same kind gets its own names', () => {
    const result = generatePage({ name: 'two', i18n: false, blocks: [defaultBlock('chip-nav', 'two'), defaultBlock('chip-nav', 'two')] });
    const ts = file(result, 'two.ts').content;
    assert.match(ts, /readonly navItems:/);
    assert.match(ts, /readonly nav2Items:/);
    assert.match(file(result, 'two.html').content, /\[items\]="nav2Items"/);
  });
});

describe('quoting', () => {
  test('quotes and double quotes in texts cannot break the code', () => {
    const header = { ...defaultBlock('page-header', 'x'), title: `It's "quoted"`, subtitle: 'Back\\slash' } as PageConfig['blocks'][number];
    const html = file(generatePage({ name: 'x', i18n: false, blocks: [header] }), 'x.html').content;
    assert.match(html, /title: 'It\\'s "quoted"'/);
    assert.match(html, /subtitle: 'Back\\\\slash'/);
  });
});

describe('class name', () => {
  test('a page named like its model gets the suffix Page', () => {
    const result = generatePage({ name: 'item', i18n: false, blocks: [defaultBlock('table', 'item')] });
    assert.match(file(result, 'item.ts').content, /export class ItemPage \{/);
    assert.equal(result.className, 'ItemPage');
    assert.equal(result.selector, 'app-item');
  });
});

describe('validation', () => {
  test('rejects what cannot produce a page', () => {
    assert.throws(() => validatePage(page({ blocks: [] })), /at least one component/);
    assert.throws(() => validatePage(page({ name: '9lives' })), /must start with a letter/);
    assert.throws(() => validatePage(page({ blocks: [defaultBlock('table', 'a'), defaultBlock('table', 'a')] })), /only one table/);
    assert.throws(() => validatePage(page({ blocks: [{ ...defaultBlock('chip-nav', 'a'), items: [] } as PageConfig['blocks'][number]] })), /at least one item/);
    assert.throws(
      () => validatePage(page({ blocks: [{ ...defaultBlock('segmented', 'a'), options: [{ id: 'x' }, { id: 'x' }] } as PageConfig['blocks'][number]] })),
      /ids must be different/
    );
  });

  test('rejects a model with a bad field name or a missing import path', () => {
    const bad: ModelSpec = { ...genericModel(), fields: [{ name: 'not valid', type: 'string' }] };
    assert.throws(() => validatePage(page({ blocks: [{ ...(defaultBlock('table', 'a') as any), model: bad }] })), /not a valid field name/);
    const missing: ModelSpec = { ...genericModel(), generate: false };
    assert.throws(() => validatePage(page({ blocks: [{ ...(defaultBlock('table', 'a') as any), model: missing }] })), /import path/);
  });
});
