/**
 * English labels. easy-mat-ui reads every label through ngx-translate: column headers come from
 * `translateTitle`, dialog fields from `<prefix><column name>`, so one dictionary serves both. The
 * demo's own texts (`app`, `nav`, `overview`, ...) live in the same dictionary.
 *
 * The other languages (fr, ar, de, lb) must have exactly these keys: they are typed as `Dictionary`.
 */
export const EN = {
  // ---- labels read by easy-mat-ui itself ------------------------------------
  countries: {
    TITLE: 'Countries',
    ENTITY: 'Country',
    code: 'Flag',
    name: 'Name',
    isoCode: 'ISO',
    dialingCode: 'Dial code',
    capital: 'Capital'
  },
  cities: {
    TITLE: 'Cities',
    ENTITY: 'City',
    flag: 'Flag',
    code: 'Code',
    name: 'Name',
    nameAr: 'Name (AR)',
    isCapital: 'Capital',
    population: 'Population',
    populationFormatted: 'Population'
  },
  TABS: { ALL: 'All cities', TOP: 'Largest' },
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
  PAGINATOR: {
    ITEMS_PER_PAGE: 'Items per page:',
    NEXT_PAGE: 'Next page',
    PREVIOUS_PAGE: 'Previous page',
    FIRST_PAGE: 'First page',
    LAST_PAGE: 'Last page',
    RANGE: '{{start}} – {{end}} of {{length}}'
  },

  // ---- the demo application --------------------------------------------------
  app: {
    SKIP: 'Skip to content',
    PAGES: 'Demo pages',
    THEME: 'Theme',
    LANGUAGE: 'Language',
    CHOOSE_LANGUAGE: 'Choose the language',
    GITHUB: 'GitHub',
    NPM: 'npm',
    FOOTER_LICENSE: 'Open source under the MIT license.',
    FOOTER_CONTRIBUTE: 'Contributions are welcome.',
    FOOTER_DATA: 'Demo data: GeoNames (CC BY 4.0) and Wikipedia (CC BY-SA 4.0).'
  },
  nav: { overview: 'Overview', countries: 'Countries & cities', tabs: 'Child tabs', cities: 'Cities' },
  continents: {
    ARIA: 'Browse by continent',
    all: 'All',
    africa: 'Africa',
    asia: 'Asia',
    europe: 'Europe',
    northAmerica: 'North America',
    southAmerica: 'South America',
    oceania: 'Oceania'
  },
  theme: { light: 'Light', dark: 'Dark', ARIA: '{{name}} theme' },
  units: {
    LABEL: 'Population',
    auto: 'Auto',
    units: 'Units',
    thousands: 'Thousands',
    millions: 'Millions',
    auto_hint: 'K, M or B depending on the value',
    units_hint: 'Full number with thousands separators',
    thousands_hint: 'Always in K',
    millions_hint: 'Always in M'
  },
  code: {
    SHOW: 'Show the code of this page',
    HIDE: 'Hide the code of this page',
    FILES: '{{count}} files',
    LINES: '{{count}} lines',
    COPY: 'Copy',
    COPIED: 'Copied',
    COPY_FILE: 'Copy this file',
    SOURCE_FILES: 'Source files',
    config: 'Columns, fields, table configuration',
    html: 'Template',
    ts: 'Component',
    scss: 'Styles'
  },
  pages: {
    countries: {
      title: 'Countries and their cities',
      subtitle: 'Every country of the world, Algeria first. Click the expand button of a row: the child table is loaded on demand with the cities of that country.'
    },
    tabs: {
      title: 'Child tables in tabs',
      subtitle: 'Pass an array to childConfig and every configuration becomes a tab. Expand a country: the first tab lists all its cities (editable), the second its ten largest (read-only).'
    },
    cities: {
      title: 'Cities of any country',
      subtitle: 'Pick a country and its cities load on demand. One table, one configuration object: typed columns, header filters (including population), status icons, pagination and a full add / edit / view / delete dialog.',
      COUNTRY: 'Country',
      STAT_CITIES: 'Cities listed',
      STAT_TOTAL: 'Total population',
      STAT_TOTAL_HINT: 'Sum of the populations of the cities listed below'
    },
    CITIES_OF: 'Cities of {{name}}',
    LARGEST_OF: 'Largest cities of {{name}}'
  },
  overview: {
    BADGE: 'Open source · MIT license',
    HERO_TITLE: 'Almost nothing to code.',
    HERO_LEAD: 'Easy Mat UI turns a simple configuration object into a complete Angular Material data table: filters, dialogs, child tables, tabs, light and dark themes, and five languages. Browse the examples: each page lets you read its own code.',
    CTA_NPM: 'Get it on npm',
    CTA_GITHUB: 'Star on GitHub',
    INSTALL_COPY: 'Copy the install command',
    INSTALL_COPIED: 'Copied',
    EXPLORE: 'Explore the demo',
    OPEN_TITLE: 'Free and open source',
    OPEN_TEXT: 'Easy Mat UI is open source under the MIT license. Anyone can use it, read the code and help make it better: report a bug, suggest a feature, fix a typo or add a language. Every contribution is welcome, from a one-line fix to a new component.',
    OPEN_REPO: 'View the source',
    OPEN_ISSUES: 'Report an issue',
    OPEN_CONTRIBUTE: 'How to contribute',
    FEATURES_TITLE: 'What the library gives you',
    FEATURES_LEAD: 'Everything below comes from one configuration object. Open a demo page to see it working.',
    TRY: 'Try it',
    features: {
      table: { t: 'Typed data table', d: 'Columns of many types (text, icon, image, number, date...) from a typed configuration.' },
      filters: { t: 'Column filters', d: 'Text and multi-select filters in the header, plus a global search, combined with AND / OR.' },
      paging: { t: 'Sorting and pagination', d: 'Sortable headers, configurable page size and a pinned header, translated by ngx-translate.' },
      child: { t: 'Child tables and tabs', d: 'Expandable rows that open a child table, or several, one tab each, loaded on demand.' },
      dialog: { t: 'Create, edit, view', d: 'A form dialog with validation, unsaved-changes warning and delete confirmation.' },
      multi: { t: 'Multi-select', d: 'A reusable multi-select with search, select all and clear.' },
      themes: { t: 'Light and dark themes', d: 'Switch at runtime with EasyThemeService. Everything is driven by CSS variables.' },
      i18n: { t: 'Multilingual, even right-to-left', d: 'Every label goes through ngx-translate. This demo speaks English, Arabic, French, German and Luxembourgish.' },
      a11y: { t: 'Responsive and accessible', d: 'Keyboard friendly, visible focus, and no WCAG 2 A/AA violation found by axe-core.' }
    },
    STEPS_ARIA: 'How it works',
    steps: {
      describe: { t: 'Describe', d: 'Columns, dialog fields, filters, actions and child tables go in one configuration file.' },
      drop: { t: 'Drop in', d: 'One component in the template: <lib-easy-table [config]="config">.' },
      done: { t: 'Done', d: 'Search, sorting, pagination, dialogs, expandable rows, tabs, themes and i18n are handled by the library.' }
    },
    IDEA_TITLE: 'The whole idea in 12 lines',
    COMPAT_TITLE: 'Angular compatibility',
    COMPAT_TEXT: 'Checked by building and running the packaged library in clean applications.',
    compat: {
      ANGULAR: 'Angular',
      STATUS: 'Status',
      DETAILS: 'Details',
      ok: 'Supported',
      warn: 'Works, not official',
      no: 'Does not work',
      note20: 'Peer range ^20.0.0.',
      note1921: 'Builds and runs; install with --legacy-peer-deps.',
      note18: 'The table fails at runtime with Material 18.',
      note1617: 'The build fails (needs @let, Angular 18.1+).'
    },
    CONTRIBUTE_TITLE: 'Join the project',
    CONTRIBUTE_LEAD: 'You do not need to be an expert. Pick what suits you.',
    ways: {
      bug: { t: 'Report a bug', d: 'Something does not behave? Open an issue with the steps to reproduce it.' },
      idea: { t: 'Suggest a feature', d: 'Tell us what would make the library more useful to you.' },
      lang: { t: 'Add a language', d: 'Translations are plain TypeScript dictionaries: copy one and translate it.' },
      code: { t: 'Send a pull request', d: 'Fix a bug, improve the docs or build a feature. Tests and CI run on every pull request.' }
    },
    FLOW_ARIA: 'Contributing in three steps',
    flow: {
      fork: 'Fork the repository and clone it',
      branch: 'Create a branch, make your change, run the tests',
      pr: 'Open a pull request: we review it together'
    },
    STAR_PLEASE: 'If the library helps you, a star on GitHub helps others find it.'
  }
};

/** Every language dictionary has the same keys, with text only. */
export type Dictionary = typeof EN;
