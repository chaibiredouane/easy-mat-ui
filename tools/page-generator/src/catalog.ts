import { title } from './naming';
import { Block, BlockType, ModelField, ModelSpec } from './types';

export type BlockCategory = 'Page' | 'Data' | 'Navigation' | 'Content' | 'Settings';

export interface BlockInfo {
  type: BlockType;
  category: BlockCategory;
  label: string;
  description: string;
  /** Material icon. */
  icon: string;
}

/** The components a page can be made of, by category. The CLI menu and the Builder of the demo both read this list. */
export const BLOCK_CATALOG: readonly BlockInfo[] = [
  { type: 'page-header', category: 'Page', label: 'Page header', description: 'Icon, title and subtitle at the top of the page.', icon: 'title' },
  { type: 'table', category: 'Data', label: 'Data table', description: 'Table with filters, pagination and an add / edit / delete dialog. It can open a second table under a row.', icon: 'table_chart' },
  { type: 'stat', category: 'Data', label: 'Key figures', description: 'A few numbers with a label, an icon and a tone.', icon: 'analytics' },
  { type: 'chip-nav', category: 'Navigation', label: 'Category buttons', description: 'Buttons with an icon, a colour and a count, to browse by category.', icon: 'category' },
  { type: 'segmented', category: 'Navigation', label: 'Segmented control', description: 'A small group of buttons of which one is chosen: a setting, a view, a page.', icon: 'toggle_on' },
  { type: 'card-grid', category: 'Content', label: 'Card grid', description: 'Cards with an icon, a title, a description and optional actions, in a responsive grid.', icon: 'grid_view' },
  { type: 'language-switch', category: 'Settings', label: 'Language picker', description: 'A menu or a row of buttons to choose the language.', icon: 'translate' }
];

export const BLOCK_CATEGORIES: readonly BlockCategory[] = ['Page', 'Data', 'Navigation', 'Content', 'Settings'];

const field = (name: string, type: ModelField['type']): ModelField => ({ name, type });

/** A model made of placeholders (`item1`, `item2`, `item3`...), to rename. */
export function genericModel(): ModelSpec {
  return {
    className: 'Item',
    fileBase: 'item',
    generate: true,
    fields: [field('id', 'number'), field('item1', 'string'), field('item2', 'string'), field('item3', 'string'), field('active', 'boolean')]
  };
}

/** The model of the rows of a child table: it points to its parent with `parentId`. */
export function genericChildModel(): ModelSpec {
  return {
    className: 'SubItem',
    fileBase: 'sub-item',
    generate: true,
    fields: [field('id', 'number'), field('parentId', 'number'), field('subItem1', 'string'), field('subItem2', 'string'), field('active', 'boolean')]
  };
}

/** A block with sensible example values, to start from. */
export function defaultBlock(type: BlockType, pageName: string): Block {
  switch (type) {
    case 'page-header':
      return { type, icon: 'dashboard', title: title(pageName), subtitle: 'Say in one sentence what this page is for.' };
    case 'stat':
      return {
        type,
        stats: [
          { label: 'Total', value: 128, icon: 'inventory_2', tone: 'accent' },
          { label: 'Active', value: 96, tone: 'success' },
          { label: 'Archived', value: 32, tone: 'neutral' }
        ]
      };
    case 'chip-nav':
      return {
        type,
        ariaLabel: 'Browse by category',
        selected: 'all',
        items: [
          { id: 'all', label: 'All', icon: 'apps', count: 12 },
          { id: 'categoryA', label: 'Category A', icon: 'folder', color: '#1d4ed8', count: 5 },
          { id: 'categoryB', label: 'Category B', icon: 'folder', color: '#15803d', count: 4 },
          { id: 'categoryC', label: 'Category C', icon: 'folder', color: '#b45309', count: 3 }
        ]
      };
    case 'segmented':
      return {
        type,
        ariaLabel: 'View',
        selected: 'list',
        options: [
          { id: 'list', label: 'List', icon: 'view_list' },
          { id: 'grid', label: 'Grid', icon: 'grid_view' }
        ]
      };
    case 'language-switch':
      return {
        type,
        ariaLabel: 'Choose the language',
        selected: 'en',
        layout: 'menu',
        display: 'flag-name',
        languages: [
          { code: 'en', name: 'English', flag: 'gb' },
          { code: 'fr', name: 'Français', flag: 'fr' },
          { code: 'de', name: 'Deutsch', flag: 'de' }
        ]
      };
    case 'card-grid':
      return {
        type,
        columns: 3,
        minWidth: 240,
        cards: [
          { id: 'card1', icon: 'rocket_launch', title: 'First card', description: 'Say what it is about.', clickable: true, cta: 'Open' },
          { id: 'card2', icon: 'tune', title: 'Second card', description: 'Another short description.', clickable: true, cta: 'Open' },
          { id: 'card3', icon: 'insights', title: 'Third card', description: 'And one more.' }
        ]
      };
    case 'table':
      return { type, title: title(pageName), icon: 'grid_view', model: genericModel(), canCreate: true, canUpdate: true, canDelete: true, filters: true, pageSize: 10 };
  }
}

/**
 * The labels the table and its dialog read from the translation file (they belong to the library, not to a page).
 * They are added at the root of the file, only when missing.
 */
export const STANDARD_TRANSLATIONS: Readonly<Record<string, string>> = {
  SEARCH: 'Search',
  FILTER: 'Filter',
  FILTERS: 'Filters',
  CLEAR: 'Clear',
  ADD: 'Add',
  CLOSE: 'Close',
  SAVE: 'Save',
  NO_OPTIONS: 'No options',
  NO_RESULTS_FOUND: 'No results found',
  details: 'Details',
  edit: 'Edit',
  Delete: 'Delete',
  Cancel: 'Cancel',
  DETECT_CHANGES: 'Unsaved changes',
  ASK_SAVE_CHANGES: 'Do you want to save your changes?',
  CONFIRMATION_SAVE: 'Save',
  CONFIRMATION_SAVE_CANCEL: 'Discard',
  UNCOMPLETED_FORM: 'Incomplete form',
  FILL_MISSING_FIELDS: 'Please fill in the required fields.',
  'PAGINATOR.ITEMS_PER_PAGE': 'Items per page:',
  'PAGINATOR.NEXT_PAGE': 'Next page',
  'PAGINATOR.PREVIOUS_PAGE': 'Previous page',
  'PAGINATOR.FIRST_PAGE': 'First page',
  'PAGINATOR.LAST_PAGE': 'Last page',
  'PAGINATOR.RANGE': '{{start}} – {{end}} of {{length}}'
};
