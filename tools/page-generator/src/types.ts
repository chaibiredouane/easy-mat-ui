/**
 * What a page is made of. A `PageConfig` is plain data (it can be written as JSON), so the CLI, the Builder of the demo
 * and a developer by hand all describe a page the same way, and `generatePage` turns it into files.
 */

export type FieldType = 'string' | 'number' | 'boolean' | 'date';

export interface ModelField {
  name: string;
  type: FieldType;
}

/** The model (the class of one row) a table works with. */
export interface ModelSpec {
  className: string;
  /** `item` for `item.model.ts`. */
  fileBase: string;
  fields: ModelField[];
  /** `true`: the model file is generated next to the page. `false`: it already exists and is imported from `importPath`. */
  generate: boolean;
  /** Where an existing model is imported from: a relative path without extension (`../models/stock-item.model`) or a module. */
  importPath?: string;
  /**
   * Properties of an existing class that the generator leaves out because they are not text, numbers, booleans or
   * dates (lists, objects...). The example rows then do not have them.
   */
  ignored?: string[];
}

export type StatTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export interface PageHeaderBlock {
  type: 'page-header';
  icon?: string;
  title: string;
  subtitle?: string;
}

export interface StatBlock {
  type: 'stat';
  stats: { label: string; value: string | number; icon?: string; tone?: StatTone; hint?: string }[];
}

export interface ChipNavBlock {
  type: 'chip-nav';
  ariaLabel: string;
  items: { id: string; label: string; icon?: string; color?: string; count?: number }[];
  selected?: string;
}

export interface SegmentedBlock {
  type: 'segmented';
  ariaLabel: string;
  options: { id: string; label?: string; icon?: string; hint?: string }[];
  selected?: string;
  iconOnly?: boolean;
  size?: 'md' | 'lg';
}

export interface LanguageSwitchBlock {
  type: 'language-switch';
  ariaLabel: string;
  languages: { code: string; name: string; flag?: string }[];
  selected?: string;
  layout?: 'menu' | 'inline';
  display?: 'flag-name' | 'flag' | 'name' | 'code';
}

export interface CardGridBlock {
  type: 'card-grid';
  cards: { id?: string; icon?: string; title: string; description?: string; clickable?: boolean; cta?: string; color?: string }[];
  /** Most columns in a row. */
  columns?: number;
  /** Narrowest a card may become, in pixels. */
  minWidth?: number;
}

export interface TableBlock {
  type: 'table';
  /** Title in the toolbar of the table. */
  title: string;
  icon?: string;
  model: ModelSpec;
  /** A second table, opened under a row of the first one. */
  child?: { title?: string; model: ModelSpec };
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  /** Filters under the column titles. */
  filters?: boolean;
  pageSize?: number;
}

export type Block = PageHeaderBlock | StatBlock | ChipNavBlock | SegmentedBlock | LanguageSwitchBlock | CardGridBlock | TableBlock;
export type BlockType = Block['type'];

export interface PageConfig {
  /** Name of the page in kebab-case: the folder, the files and the selector come from it. */
  name: string;
  /** Prefix of the selector of the component (`app` gives `<app-stock>`). */
  selectorPrefix?: string;
  /** Package the components are imported from. Default `easy-mat-ui-ng20`. */
  libPackage?: string;
  /** `true`: texts go through ngx-translate (keys + entries for the translation file). `false`: plain texts. */
  i18n: boolean;
  /** First part of the translation keys. Default `PAGES`. */
  i18nRoot?: string;
  blocks: Block[];
}

export interface GeneratedFile {
  /** Path relative to the folder of the page. */
  path: string;
  content: string;
  role: 'component' | 'template' | 'config' | 'model';
}

export interface GenerationResult {
  /** Name of the component class and its selector, to tell the developer how to use the page. */
  className: string;
  selector: string;
  files: GeneratedFile[];
  /** Entries for the English translation file, as flat keys (`PAGES.STOCK.TITLE`). Empty without i18n. */
  translations: Record<string, string>;
  /** Keys of the library itself (`SEARCH`, `Delete`...), at the root of the file; to add only when they are missing. */
  standardTranslations: Record<string, string>;
  warnings: string[];
}
