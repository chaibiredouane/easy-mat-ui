import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  EasyCardGrid,
  EasyChipNav,
  EasyLanguageSwitch,
  EasyPageHeader,
  EasySegmented,
  EasySegmentedOption,
  EasyStat,
  EasyTableComponent
} from 'easy-mat-ui';
import {
  BLOCK_CATALOG,
  BLOCK_CATEGORIES,
  Block,
  BlockType,
  CardGridBlock,
  ChipNavBlock,
  GeneratedFile,
  GenerationResult,
  LanguageSwitchBlock,
  ModelSpec,
  PageConfig,
  PageHeaderBlock,
  SegmentedBlock,
  StatBlock,
  TableBlock,
  camel,
  defaultBlock,
  generatePage,
  genericChildModel,
  kebab,
  pascal,
  singular
} from '@easy-mat-ui/page-generator';
import { LanguageService } from '../../services/language.service';
import { Row, RowColumn, RowsEditor } from '../../shared/rows-editor/rows-editor';
import { previewTable } from './preview-table';

/** The order of the blocks in a generated page: header first, the table last. */
const ORDER: BlockType[] = ['page-header', 'stat', 'chip-nav', 'segmented', 'language-switch', 'card-grid', 'table'];

const LANGUAGE_CATALOG = [
  { code: 'en', name: 'English', flag: 'gb' },
  { code: 'fr', name: 'Français', flag: 'fr' },
  { code: 'de', name: 'Deutsch', flag: 'de' },
  { code: 'ar', name: 'العربية', flag: 'dz' },
  { code: 'lb', name: 'Lëtzebuergesch', flag: 'lu' },
  { code: 'es', name: 'Español', flag: 'es' },
  { code: 'it', name: 'Italiano', flag: 'it' },
  { code: 'pt', name: 'Português', flag: 'pt' },
  { code: 'nl', name: 'Nederlands', flag: 'nl' }
];

/** `a.b.c: text` entries as the nested object of a translation file. */
function nest(flat: Record<string, string>): Record<string, unknown> {
  const root: Record<string, any> = {};
  for (const [key, text] of Object.entries(flat)) {
    const parts = key.split('.');
    let node = root;
    for (const part of parts.slice(0, -1)) node = node[part] ??= {};
    node[parts[parts.length - 1]] = text;
  }
  return root;
}

/** An id for a list item, taken from its label and different from the ones before it. */
function idsFor(labels: string[]): string[] {
  const used = new Set<string>();
  return labels.map((label, index) => {
    let id = camel(label) || `item${index + 1}`;
    while (used.has(id)) id = `${id}${index + 1}`;
    used.add(id);
    return id;
  });
}

const text = (value: unknown): string => (typeof value === 'string' ? value : value === undefined ? '' : String(value));
const orUndefined = (value: unknown): string | undefined => text(value).trim() || undefined;

/**
 * The page builder: the same description of a page (`PageConfig`) that the `easy-mat-ui add-page` command reads is built
 * here with simple controls, shown live with the real components, and turned into code by the same generator.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-builder',
  imports: [
    MatIconModule,
    TranslatePipe,
    EasyPageHeader,
    EasyStat,
    EasyChipNav,
    EasySegmented,
    EasyLanguageSwitch,
    EasyCardGrid,
    EasyTableComponent,
    RowsEditor
  ],
  templateUrl: './builder.html',
  styleUrl: './builder.scss'
})
export class Builder {
  private readonly translate = inject(TranslateService);
  private readonly lang = inject(LanguageService);

  readonly catalog = BLOCK_CATALOG;
  readonly categories = BLOCK_CATEGORIES;
  readonly languageCatalog = LANGUAGE_CATALOG;

  // ---- what the visitor chooses -----------------------------------------------------------------------------------
  readonly name = signal('stock-items');
  readonly i18n = signal(true);
  readonly selected = signal<BlockType[]>(['page-header', 'table']);
  /** Blocks the visitor changed; the others show their example values. */
  private readonly drafts = signal<Partial<Record<BlockType, Block>>>({});
  readonly modelMode = signal<'generic' | 'own'>('generic');
  readonly ownFields = signal<Row[]>([
    { name: 'name', type: 'string' },
    { name: 'quantity', type: 'number' },
    { name: 'isActive', type: 'boolean' }
  ]);
  readonly childTable = signal(false);

  readonly pageName = computed(() => kebab(this.name()));

  // ---- the description of the page ---------------------------------------------------------------------------------
  private current<T extends Block>(type: T['type']): T {
    return (this.drafts()[type] ?? defaultBlock(type, this.pageName() || 'page')) as T;
  }

  private resolved(type: BlockType): Block {
    if (type !== 'table') return this.current(type);
    const base = this.current<TableBlock>('table');
    const name = singular(this.pageName() || 'item') || 'item';
    const own: ModelSpec = {
      className: pascal(name),
      fileBase: kebab(name),
      generate: true,
      fields: [
        { name: 'id', type: 'number' },
        ...this.ownFields()
          .map((row) => ({ name: text(row['name']).trim(), type: (text(row['type']) || 'string') as ModelSpec['fields'][number]['type'] }))
          .filter((field, index, all) => field.name && field.name !== 'id' && all.findIndex((f) => f.name === field.name) === index)
      ]
    };
    return {
      ...base,
      model: this.modelMode() === 'own' ? own : base.model,
      child: this.childTable() ? { title: `${base.title} details`, model: genericChildModel() } : undefined
    };
  }

  readonly blocks = computed(() => ORDER.filter((type) => this.selected().includes(type)).map((type) => this.resolved(type)));
  readonly config = computed<PageConfig>(() => ({ name: this.pageName(), i18n: this.i18n(), blocks: this.blocks() }));

  readonly outcome = computed<{ result: GenerationResult | null; error: string }>(() => {
    try {
      return { result: generatePage(this.config()), error: '' };
    } catch (error) {
      return { result: null, error: error instanceof Error ? error.message : String(error) };
    }
  });

  // ---- generated files ----------------------------------------------------------------------------------------------
  readonly files = computed<GeneratedFile[]>(() => {
    const result = this.outcome().result;
    if (!result) return [];
    const entries = { ...result.translations, ...result.standardTranslations };
    const files = [...result.files];
    if (Object.keys(entries).length) files.push({ path: 'en.json', role: 'config', content: `${JSON.stringify(nest(entries), null, 2)}\n` });
    return files;
  });
  readonly fileOptions = computed<EasySegmentedOption[]>(() => this.files().map((file) => ({ id: file.path, label: file.path })));
  readonly activePath = signal('');
  readonly activeFile = computed(() => this.files().find((file) => file.path === this.activePath()) ?? this.files()[0]);
  readonly copied = signal('');

  readonly command = computed(() => `npx easy-mat-ui add-page --config ${this.pageName() || 'my-page'}.page.json`);

  // ---- the blocks, for the preview and the settings --------------------------------------------------------------------
  private find<T extends Block>(type: T['type']): T | undefined {
    return this.blocks().find((block) => block.type === type) as T | undefined;
  }
  readonly header = computed(() => this.find<PageHeaderBlock>('page-header'));
  readonly stat = computed(() => this.find<StatBlock>('stat'));
  readonly nav = computed(() => this.find<ChipNavBlock>('chip-nav'));
  readonly segmented = computed(() => this.find<SegmentedBlock>('segmented'));
  readonly language = computed(() => this.find<LanguageSwitchBlock>('language-switch'));
  readonly cards = computed(() => this.find<CardGridBlock>('card-grid'));
  readonly table = computed(() => this.find<TableBlock>('table'));
  readonly tableConfig = computed(() => {
    const table = this.table();
    return table ? previewTable(table) : null;
  });

  readonly navSelected = signal<string | null>(null);
  readonly segmentedSelected = signal<string | null>(null);
  readonly languageSelected = signal<string | null>(null);

  /** What the preview shows as chosen: the user's pick, else the block's own choice, else its first entry (none if empty). */
  navCurrent(n: ChipNavBlock): string {
    return this.navSelected() ?? n.selected ?? n.items[0]?.id ?? '';
  }
  segmentedCurrent(g: SegmentedBlock): string {
    return this.segmentedSelected() ?? g.selected ?? g.options[0]?.id ?? '';
  }
  languageCurrent(l: LanguageSwitchBlock): string {
    return this.languageSelected() ?? l.selected ?? l.languages[0]?.code ?? '';
  }

  // ---- labels of the editors (they follow the language of the demo) ----------------------------------------------------
  private t(key: string): string {
    return this.translate.instant(key);
  }
  private readonly texts = computed(() => {
    this.lang.current();
    return (key: string) => this.t(key);
  });

  readonly statColumns = computed<RowColumn[]>(() => {
    const t = this.texts();
    return [
      { key: 'label', label: t('builder.f.label'), type: 'text' },
      { key: 'value', label: t('builder.f.value'), type: 'text' },
      { key: 'icon', label: t('builder.f.icon'), type: 'text' },
      { key: 'tone', label: t('builder.f.tone'), type: 'select', options: ['neutral', 'accent', 'success', 'warning', 'danger'].map((v) => ({ value: v, label: t(`builder.tones.${v}`) })) }
    ];
  });
  readonly navColumns = computed<RowColumn[]>(() => {
    const t = this.texts();
    return [
      { key: 'label', label: t('builder.f.label'), type: 'text' },
      { key: 'icon', label: t('builder.f.icon'), type: 'text' },
      { key: 'color', label: t('builder.f.color'), type: 'color' },
      { key: 'count', label: t('builder.f.count'), type: 'number' }
    ];
  });
  readonly segmentedColumns = computed<RowColumn[]>(() => {
    const t = this.texts();
    return [
      { key: 'label', label: t('builder.f.label'), type: 'text' },
      { key: 'icon', label: t('builder.f.icon'), type: 'text' }
    ];
  });
  readonly cardColumns = computed<RowColumn[]>(() => {
    const t = this.texts();
    return [
      { key: 'title', label: t('builder.f.title'), type: 'text' },
      { key: 'description', label: t('builder.f.description'), type: 'text' },
      { key: 'icon', label: t('builder.f.icon'), type: 'text' },
      { key: 'clickable', label: t('builder.f.clickable'), type: 'checkbox' }
    ];
  });
  readonly fieldColumns = computed<RowColumn[]>(() => {
    const t = this.texts();
    return [
      { key: 'name', label: t('builder.f.name'), type: 'text' },
      { key: 'type', label: t('builder.f.type'), type: 'select', options: ['string', 'number', 'boolean', 'date'].map((v) => ({ value: v, label: t(`builder.types.${v}`) })) }
    ];
  });
  readonly modelOptions = computed<EasySegmentedOption[]>(() => {
    const t = this.texts();
    return [
      { id: 'generic', label: t('builder.MODEL_GENERIC'), icon: 'auto_awesome' },
      { id: 'own', label: t('builder.MODEL_OWN'), icon: 'edit' }
    ];
  });
  readonly textOptions = computed<EasySegmentedOption[]>(() => {
    const t = this.texts();
    return [
      { id: 'keys', label: t('builder.TEXTS_KEYS'), icon: 'translate' },
      { id: 'plain', label: t('builder.TEXTS_PLAIN'), icon: 'subject' }
    ];
  });

  // ---- actions -----------------------------------------------------------------------------------------------------------
  isOn(type: BlockType): boolean {
    return this.selected().includes(type);
  }

  toggle(type: BlockType): void {
    this.selected.update((list) => (list.includes(type) ? list.filter((t) => t !== type) : [...list, type]));
  }

  /** Changes some properties of a block; the others keep their value. */
  patch<T extends Block>(type: T['type'], changes: Partial<T>): void {
    this.drafts.update((drafts) => ({ ...drafts, [type]: { ...this.current<T>(type), ...changes } }));
  }

  // A template cannot give the type of a generic call, so each block has its own small method.
  patchHeader(changes: Partial<PageHeaderBlock>): void {
    this.patch<PageHeaderBlock>('page-header', changes);
  }
  patchSegmented(changes: Partial<SegmentedBlock>): void {
    this.patch<SegmentedBlock>('segmented', changes);
  }
  patchLanguage(changes: Partial<LanguageSwitchBlock>): void {
    this.patch<LanguageSwitchBlock>('language-switch', changes);
  }
  patchCards(changes: Partial<CardGridBlock>): void {
    this.patch<CardGridBlock>('card-grid', changes);
  }
  patchTable(changes: Partial<TableBlock>): void {
    this.patch<TableBlock>('table', changes);
  }

  readonly layoutOptions = ['menu', 'inline'] as const;
  readonly displayOptions = ['flag-name', 'flag', 'name', 'code'] as const;
  readonly sizeOptions = ['md', 'lg'] as const;
  readonly columnOptions = [2, 3, 4] as const;
  readonly pageSizes = [5, 10, 25] as const;

  field(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  checked(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
  }

  setStats(rows: Row[]): void {
    this.patch<StatBlock>('stat', {
      stats: rows.map((row) => {
        const raw = text(row['value']).trim();
        return {
          label: text(row['label']),
          value: raw !== '' && !Number.isNaN(Number(raw)) ? Number(raw) : raw,
          icon: orUndefined(row['icon']),
          tone: (orUndefined(row['tone']) as StatBlock['stats'][number]['tone']) ?? 'neutral'
        };
      })
    });
  }

  setNav(rows: Row[]): void {
    const ids = idsFor(rows.map((row) => text(row['label'])));
    this.patch<ChipNavBlock>('chip-nav', {
      items: rows.map((row, i) => ({
        id: ids[i],
        label: text(row['label']),
        icon: orUndefined(row['icon']),
        color: orUndefined(row['color']),
        count: typeof row['count'] === 'number' ? row['count'] : undefined
      }))
    });
  }

  setSegmented(rows: Row[]): void {
    const ids = idsFor(rows.map((row) => text(row['label'])));
    this.patch<SegmentedBlock>('segmented', {
      options: rows.map((row, i) => ({ id: ids[i], label: orUndefined(row['label']), icon: orUndefined(row['icon']) }))
    });
  }

  setCards(rows: Row[]): void {
    const ids = idsFor(rows.map((row) => text(row['title'])));
    this.patch<CardGridBlock>('card-grid', {
      cards: rows.map((row, i) => ({
        id: ids[i],
        title: text(row['title']),
        description: orUndefined(row['description']),
        icon: orUndefined(row['icon']),
        clickable: !!row['clickable'],
        cta: row['clickable'] ? 'Open' : undefined
      }))
    });
  }

  hasLanguage(code: string): boolean {
    return !!this.language()?.languages.some((language) => language.code === code);
  }

  toggleLanguage(code: string): void {
    const block = this.language();
    if (!block) return;
    const present = block.languages.some((language) => language.code === code);
    const languages = present ? block.languages.filter((language) => language.code !== code) : [...block.languages, LANGUAGE_CATALOG.find((language) => language.code === code)!];
    if (languages.length) this.patch<LanguageSwitchBlock>('language-switch', { languages, selected: languages.some((l) => l.code === block.selected) ? block.selected : languages[0].code });
  }

  rowsOf(items: unknown[]): Row[] {
    return items as Row[];
  }

  async copy(key: string, content: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(content);
      this.copied.set(key);
      setTimeout(() => this.copied.set(''), 1500);
    } catch {
      /* clipboard unavailable (insecure context): the text remains selectable */
    }
  }

  download(): void {
    try {
      const blob = new Blob([`${JSON.stringify(this.config(), null, 2)}\n`], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${this.pageName() || 'my-page'}.page.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      /* downloads blocked: the description can still be copied from the generated code */
    }
  }
}
