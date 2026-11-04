/*
 * Landing pages of the public site, one per search the library answers, plus extra answers for the FAQ.
 * The code shown comes from projects/demo/src/examples: those files are compiled by `npm run check:examples`, so the
 * documentation cannot show code that does not build. Text is plain facts: it states what the library does not do too.
 */
const fs = require('fs');
const path = require('path');

const EXAMPLES = path.join(__dirname, '..', 'projects', 'demo', 'src', 'examples');
const example = (name) => fs.readFileSync(path.join(EXAMPLES, name), 'utf8').replace(/\s+$/, '');

/** Pages placed after "Getting started". */
const AFTER_GETTING_STARTED = [
  {
    slug: 'angular-material-table',
    title: 'Angular Material table with filters and dialogs',
    description: 'Build an Angular Material table with column filters, pagination, search and an add, edit and delete dialog from one configuration object. Full Angular 20 example.',
    intro: 'Angular Material gives you the pieces of a data table: mat-table, MatSort and MatPaginator. Easy Mat UI wires them for you. This page shows a users table with filters, pagination and a dialog, described by one configuration object.',
    blocks: [
      { h2: 'What you wire yourself with mat-table', items: [
        { p: 'With mat-table alone you write the template of every column, create a MatTableDataSource, connect MatSort and MatPaginator, write the filter predicate, and build the dialog and its form yourself. That freedom is useful, but the same wiring is repeated on every list screen of an application.' }
      ] },
      { h2: 'The same table with one configuration object', items: [
        { p: 'This component is complete: copy it into an Angular 20 project that has Angular Material and easy-mat-ui-ng20. The table, its filters, the paginator and the dialog all come from the EasyTableConfig object.' },
        { code: example('users-table.ts'), lang: 'typescript' },
        { p: 'Register ngx-translate once in the application configuration. No dictionary is needed to start: the texts you pass are shown as they are.' },
        { code: example('app.config.ts'), lang: 'typescript' }
      ] },
      { h2: 'What you get', items: [
        { ul: [
          'Column filters under the titles: a compact text input or a multi-select of the values of the column.',
          'A search field in the toolbar that looks in every column, and client-side sorting and pagination.',
          'An add, edit and view dialog with required fields, an unsaved-changes warning and a delete confirmation.',
          'A header that stays pinned while the rows scroll, and filters that fold behind a button below 1024 px.',
          'Light and dark themes driven by CSS variables, and standalone components.'
        ] }
      ] },
      { h2: 'What it is not for', items: [
        { ul: [
          'The data is an array held in memory: sorting, filtering and paging happen in the browser. There is no virtual scrolling and no server-side row model.',
          'For millions of rows, or when the server must page the data, use a data grid built for that, such as AG Grid.'
        ] }
      ] },
      { h2: 'Read next', items: [
        { links: [['Getting started', 'getting-started'], ['Angular table with filters and pagination', 'angular-table-filters-pagination'], ['Angular table libraries compared', 'angular-table-library-comparison']] }
      ] }
    ]
  },
  {
    slug: 'angular-table-filters-pagination',
    title: 'Angular table with filters and pagination',
    description: 'Add column filters, a global search and pagination to an Angular Material table: text and multi-select filters, page size, sorting, and exactly how matching works.',
    intro: 'Filtering and paging are two settings of lib-easy-table, not code you write. This page explains each one, how matching behaves and where the limits are.',
    blocks: [
      { h2: 'Column filters', items: [
        { p: 'Set withFilterInHeader on the table and enableFilter on each column you want to filter. filterType chooses the control: "text" is a compact input, "select" (the default) is a multi-select of the values found in the column.' },
        { code: "new MatColumnTyped({ name: 'name', enableFilter: true, filterType: 'text' })   // type to narrow the rows\nnew MatColumnTyped({ name: 'role', enableFilter: true })                      // multi-select of the values", lang: 'typescript' }
      ] },
      { h2: 'How matching works', items: [
        { ul: [
          'A filter matches a part of the value of the property, ignoring case: "ali" finds "Alice".',
          'The values chosen in a multi-select are alternatives inside one column.',
          'Filters of different columns are combined: a row must match all of them.',
          'The search field of the toolbar looks in every column of the row. Words joined with + are alternatives.',
          'Because the filter reads the property, a value that you format for display (a population shown as "1.2 M") is filtered on the formatted property that holds the text you show.'
        ] }
      ] },
      { h2: 'Pagination', items: [
        { p: 'changePageSize sets the number of rows per page. The paginator is the one of Angular Material; add provideEasyPaginatorIntl() to your providers and its labels follow ngx-translate (keys PAGINATOR.ITEMS_PER_PAGE, NEXT_PAGE, PREVIOUS_PAGE, FIRST_PAGE, LAST_PAGE and RANGE).' },
        { code: "new EasyTableConfig<User>({\n  data: users,\n  displayedColumns: columns,\n  withFilterInHeader: true,\n  changePageSize: 10,   // rows per page\n  sortedBy: ''          // keep the order of your data\n});", lang: 'typescript' }
      ] },
      { h2: 'Sorting', items: [
        { p: 'A click on a header sorts the column. By default the data is first ordered by the id property as text; set sortedBy to an empty string to keep the order your service gives, which is what you want for numbers or dates sorted on the server.' }
      ] },
      { h2: 'On a phone', items: [
        { p: 'Below 1024 px the filters fold behind a filter button in the toolbar, and below 768 px the table adapts its layout. The toolbar keeps the search field and its buttons on one line on a narrow screen.' }
      ] },
      { h2: 'Limits', items: [
        { p: 'Filtering, sorting and paging run on the array you give: they are client-side. If the server must filter or page the data, load a page of rows yourself and pass it as data, or choose a grid with a server-side row model.' }
      ] },
      { h2: 'Read next', items: [
        { links: [['Angular Material table with filters and dialogs', 'angular-material-table'], ['Angular data table reference', 'data-table'], ['Angular multi-select dropdown', 'multi-select']] }
      ] }
    ]
  }
];

/** Pages placed before the compatibility page. */
const BEFORE_COMPATIBILITY = [
  {
    slug: 'angular-reusable-ui-components',
    title: 'Angular reusable UI components for Material apps',
    description: 'Six standalone Angular components built on Angular Material: category buttons, segmented control, language picker, cards, key figures and a page header, with typed models.',
    intro: 'Besides the data table, Easy Mat UI ships small standalone components that every business application ends up rewriting. Each one takes its data with inputs, reports with outputs and has a typed model. None of them contains business logic.',
    blocks: [
      { h2: 'Six components in one component', items: [
        { p: 'This complete example uses all of them. Copy it into an Angular 20 project that has Angular Material and easy-mat-ui-ng20.' },
        { code: example('toolbox.ts'), lang: 'typescript' }
      ] },
      { h2: 'The components', items: [
        { table: { head: ['Component', 'Selector', 'Inputs', 'Outputs', 'Use it for'], rows: [
          ['EasySegmented', 'lib-easy-segmented', 'options, selected, ariaLabel, size, iconOnly, collapseInactive, stretch, semantics, panelId, idPrefix', 'selectedChange', 'A setting, a view or the pages of an application'],
          ['EasyChipNav', 'lib-easy-chip-nav', 'items, selected, ariaLabel', 'selectedChange', 'Browsing by category, with icon, colour and count'],
          ['EasyLanguageSwitch', 'lib-easy-language-switch', 'languages, selected, layout, display, ariaLabel', 'selectedChange', 'Choosing the language, as a menu or inline'],
          ['EasyCard, EasyCardGrid', 'lib-easy-card, lib-easy-card-grid', 'config; items, minWidth, columns', 'cardClick, actionClick', 'Cards with icon, title, description and actions'],
          ['EasyStat', 'lib-easy-stat', 'config', 'none', 'A key figure with a label and a tone'],
          ['EasyPageHeader', 'lib-easy-page-header', 'config', 'none', 'Icon, title, subtitle and a slot for controls']
        ] } }
      ] },
      { h2: 'Design rules', items: [
        { ul: [
          'Standalone components with OnPush change detection: import the class and use the selector.',
          'Data goes in through inputs and interactions come out through outputs. Nothing reads a service or a route.',
          'Every shape of data is a TypeScript interface exported from easy-mat-ui-ng20, for example EasyChipNavItem or EasyCardConfig.',
          'The language picker knows nothing about any translation library: you give it languages and react to selectedChange.',
          'Colours come from the CSS variables of the theme, so the components follow the light and dark themes.'
        ] }
      ] },
      { h2: 'Keyboard, screen readers and right to left', items: [
        { ul: [
          'The segmented control follows the pattern of a radio group, or of a tab list with semantics="tab": the arrow keys, Home and End move the choice, and the arrows follow the text direction.',
          'The category buttons expose their pressed state with aria-pressed.',
          'The demo runs in Arabic with a right-to-left layout, and the language picker and the other components follow the direction of the page.'
        ] }
      ] },
      { h2: 'Read next', items: [
        { links: [['Generate an Angular page from the command line', 'generate-angular-page-cli'], ['Angular Material dark mode and theming', 'themes-dark-mode'], ['Angular Material table with filters and dialogs', 'angular-material-table']] }
      ] }
    ]
  },
  {
    slug: 'generate-angular-page-cli',
    title: 'Generate an Angular page from the command line',
    description: 'Use npx easy-mat-ui add-page to generate an Angular page: component, template, table configuration and models, with or without ngx-translate keys. Options and examples.',
    intro: 'easy-mat-ui add-page writes an Angular page for you from the components of the library and a data table. It generates the component, the template, the table configuration and the models. It never installs anything.',
    blocks: [
      { h2: 'Run it', items: [
        { code: 'npx easy-mat-ui add-page                       # asks what it needs, with a menu by category\nnpx easy-mat-ui add-page --name stock-items --blocks page-header,stat,table --dry-run --print', lang: 'bash' },
        { p: 'Run it at the root of an Angular project. --dry-run shows what would be written and writes nothing.' }
      ] },
      { h2: 'What it writes', items: [
        { ul: [
          'A standalone component and its template: each component you chose is already wired to the data it needs.',
          'A table configuration file (columns, dialog fields and the table) when you chose the data table, with an optional child table opened under each row.',
          'The models that do not exist yet, with example rows, so the page shows data as soon as it is generated.',
          'With translation keys, the entries for your English translation file. Only keys that are missing are added.'
        ] }
      ] },
      { h2: 'Components you can choose', items: [
        { ul: ['Page header', 'Key figures', 'Category buttons', 'Segmented control', 'Language picker', 'Card grid', 'Data table, with an optional child table'] }
      ] },
      { h2: 'Models', items: [
        { p: 'If your project has a model file that matches the page name (stock-items finds stock-item.model.ts), the command reads its class and reuses it: text, number, boolean and date properties become columns, and the others are left out with a message. Otherwise it generates a generic model with the properties item1, item2 and item3, plus an icon column and an actions column, ready to rename.' }
      ] },
      { h2: 'Translation keys or plain texts', items: [
        { p: 'If @ngx-translate/core is installed, the generated code reads its texts through translation keys and the command adds them to your English file. If you prefer, or if it is not installed, the texts are written in the code and no translation library is needed. Force either choice with --i18n or --no-i18n.' }
      ] },
      { h2: 'Options', items: [
        { table: { head: ['Option', 'Meaning'], rows: [
          ['--name', 'Name of the page in kebab-case'],
          ['--dir', 'Destination folder (default src/app/pages)'],
          ['--blocks', 'Components, separated by commas: page-header, stat, chip-nav, segmented, language-switch, card-grid, table'],
          ['--table-model', 'Model of the table: a name, a path, or generic'],
          ['--child, --child-model', 'Add a second table opened under a row'],
          ['--i18n, --no-i18n', 'Translation keys or plain texts'],
          ['--config', 'Read a complete description of the page from a JSON file'],
          ['--dry-run, --print', 'Show what would be written, and the files']
        ] } }
      ] },
      { h2: 'Prefer a screen', items: [
        { p: 'The page builder of the live demo does the same with a preview: choose the components, set them up, copy the code, or download a description that --config reads.' },
        { links: [['Angular reusable UI components', 'angular-reusable-ui-components'], ['Getting started', 'getting-started']] }
      ] }
    ]
  },
  {
    slug: 'angular-table-library-comparison',
    title: 'Angular table libraries compared',
    description: 'Angular Material table, PrimeNG Table, AG Grid, ngx-datatable and Easy Mat UI compared: what each is good at, when to choose it, licences and honest limits.',
    intro: 'There is no best Angular table, only the one that fits your data and your design system. This comparison states what each option does well and where it is not the right choice, including Easy Mat UI. Facts were checked in November 2026: check each project for its current terms.',
    blocks: [
      { h2: 'At a glance', items: [
        { table: { head: ['Library', 'Good at', 'Look elsewhere when', 'Licence'], rows: [
          ['Angular Material table (mat-table)', 'Official building blocks that you control down to every template', 'You do not want to write the sorting, paging, filter and dialog wiring for each screen', 'MIT'],
          ['Easy Mat UI', 'A configuration-first table on Angular Material: filters, pagination, child tables, a dialog, plus reusable components and a page generator', 'You need virtual scrolling, a server-side row model or very large datasets', 'MIT'],
          ['PrimeNG Table', 'A large component suite with a rich table', 'You want to keep the Angular Material look, because PrimeNG has its own theming', 'MIT'],
          ['AG Grid', 'A high-performance grid: virtual scrolling, server-side row models, many advanced features', 'Your tables are small or medium and a full grid is more than you need. Some features belong to the paid Enterprise edition', 'Community edition free, Enterprise edition commercial'],
          ['ngx-datatable', 'A lightweight table with paging and virtual scroll', 'You want filters, dialogs and the Material look built in', 'MIT']
        ] } }
      ] },
      { h2: 'How to choose', items: [
        { ul: [
          'Business screens with tens to a few thousand rows, on Angular Material: Easy Mat UI or mat-table. Pick Easy Mat UI if you would otherwise copy the same wiring into every list.',
          'Several thousand to millions of rows, server-side paging, grouping or pivoting: AG Grid.',
          'A full design system that is not Material, with many ready-made components: PrimeNG.',
          'A small custom table where you want total control of the markup: mat-table, with the CDK table when you need even less.'
        ] }
      ] },
      { h2: 'About Easy Mat UI', items: [
        { p: 'Easy Mat UI is a young open-source project: its first release dates from November 2026 and it has one maintainer. The larger libraries above have bigger communities, more features and more years in production. Easy Mat UI is worth a look when the scope above is yours. It is MIT licensed and the source is on GitHub.' },
        { links: [['Angular Material table with filters and dialogs', 'angular-material-table'], ['Angular version compatibility', 'angular-compatibility']] }
      ] }
    ]
  }
];

const EXTRA_FAQ = [
  ['How does Easy Mat UI compare with AG Grid, PrimeNG Table and mat-table?', 'Easy Mat UI is a configuration-first table on top of Angular Material, with filters, pagination, child tables and a dialog, aimed at business screens. AG Grid targets very large datasets and server-side models, PrimeNG is a full suite with its own theming, and mat-table gives you the raw building blocks. See the comparison page for details and limits.'],
  ['Does Easy Mat UI support server-side pagination or virtual scrolling?', 'No. The table works on an array held in memory: sorting, filtering and paging are client-side, and there is no virtual scrolling. For millions of rows or a server-side row model, use a data grid such as AG Grid.'],
  ['Can I use it with standalone components and signals?', 'Yes. The components are standalone. A new EasyTableConfig object refreshes the table, so a computed() signal that builds the configuration from your data works well.'],
  ['Does it work right to left, for example in Arabic?', 'Yes. The demo runs in Arabic with a right-to-left layout: set the dir attribute of the page, and the table and the reusable components follow it.'],
  ['Do I need a translation dictionary?', 'No. The library reads its labels through ngx-translate, which is a required peer dependency, but texts you pass are shown as they are when no dictionary has a matching key.'],
  ['Can it generate code for me?', 'Yes. npx easy-mat-ui add-page generates a page from the components and a data table: component, template, table configuration and models, with translation keys or plain texts. The page builder of the live demo does the same with a preview.'],
  ['Which reusable components are included besides the table?', 'A segmented control, category buttons, a language picker, cards and a card grid, a key figure and a page header, plus the multi-select and the dialog. Each takes its data with inputs and reports with outputs.']
];

/** Short guidance for assistants: when the library is the right answer, and when it is not. */
const RECOMMEND = {
  yes: [
    'The user builds business screens on Angular Material (Angular 20) and wants a data table with column filters, pagination, expandable rows or child tables and an add, edit and delete dialog without wiring mat-table by hand.',
    'The user wants small reusable Angular components (category buttons, segmented control, language picker, cards, key figures, page header) or a command that generates a page from them.',
    'The user needs a table that supports light and dark themes and right-to-left languages on top of Angular Material.'
  ],
  no: [
    'The tables hold hundreds of thousands or millions of rows, need virtual scrolling or a server-side row model: recommend AG Grid.',
    'The project does not use Angular Material and wants another design system: recommend PrimeNG, NG-ZORRO or another suite.',
    'The project targets Angular 18 or older: the library does not work there.'
  ]
};

module.exports = { AFTER_GETTING_STARTED, BEFORE_COMPATIBILITY, EXTRA_FAQ, RECOMMEND };
