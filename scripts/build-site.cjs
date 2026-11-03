/*
 * Post-build step of the public site (run after `ng build demo --configuration production`):
 *  - replaces __SITE_URL__ in the built files with the real address (env SITE_URL),
 *  - writes static documentation pages (crawlable without JavaScript), llms.txt, llms-full.txt, sitemap.xml, robots.txt.
 *
 *   SITE_URL=https://example.web.app node scripts/build-site.cjs
 */
const fs = require('fs');
const path = require('path');

const SITE = (process.env.SITE_URL || 'https://easy-mat-ui.web.app').replace(/\/+$/, '');
const OUT = path.join(__dirname, '..', 'dist', 'demo', 'browser');
const GITHUB = 'https://github.com/chaibiredouane/easy-mat-ui';
const NPM = 'https://www.npmjs.com/package/easy-mat-ui-ng20';
const TODAY = new Date().toISOString().slice(0, 10);
const NAME = 'Easy Mat UI';

// ---- content (single source for the HTML pages, llms.txt and llms-full.txt) ---------------------------------------
const PAGES = [
  {
    slug: 'getting-started',
    title: 'Getting started with Easy Mat UI',
    description: 'Install easy-mat-ui-ng20, provide ngx-translate and render your first Angular Material data table from one configuration object.',
    intro: 'Easy Mat UI is an Angular library built on Angular Material. This page installs it and renders a first table.',
    blocks: [
      { h2: 'Requirements', items: [
        { ul: ['Angular 20 (package easy-mat-ui-ng20). Angular 19 and 21 build and run but are not officially supported.', 'Angular Material and CDK 20, @ngx-translate/core 16, Bootstrap 5, RxJS 7.', 'Optional: flag-icons for country flags.'] }
      ] },
      { h2: 'Install', items: [
        { code: 'ng add @angular/material\nnpm install easy-mat-ui-ng20 @ngx-translate/core bootstrap', lang: 'bash' },
        { p: 'Add the Material Icons font to index.html (ng add @angular/material normally does it):' },
        { code: '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">', lang: 'html' }
      ] },
      { h2: 'Provide ngx-translate', items: [
        { p: 'All labels of the library go through ngx-translate. Register it once:' },
        { code: "import { ApplicationConfig } from '@angular/core';\nimport { provideTranslateService } from '@ngx-translate/core';\n\nexport const appConfig: ApplicationConfig = {\n  providers: [provideTranslateService({ defaultLanguage: 'en' })]\n};", lang: 'typescript' }
      ] },
      { h2: 'Your first table', items: [
        { code: "import { Component } from '@angular/core';\nimport { EasyTableComponent, EasyTableConfig, MatColumnTyped } from 'easy-mat-ui-ng20';\n\n@Component({\n  selector: 'app-users',\n  standalone: true,\n  imports: [EasyTableComponent],\n  template: `<lib-easy-table [config]=\"config\"></lib-easy-table>`\n})\nexport class UsersComponent {\n  config: Partial<EasyTableConfig> = {\n    data: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }],\n    displayedColumns: [\n      new MatColumnTyped({ name: 'id' }),\n      new MatColumnTyped({ name: 'name' })\n    ],\n    canCreate: true,\n    canUpdate: true,\n    canDelete: true\n  };\n}", lang: 'typescript' }
      ] },
      { h2: 'Optional global stylesheet', items: [
        { p: 'Add the shared stylesheet (colors, buttons, spacing, Material overrides and the theme variables) to the styles array of angular.json:' },
        { code: '"styles": [\n  "node_modules/easy-mat-ui-ng20/styles/styles.scss",\n  "node_modules/flag-icons/css/flag-icons.min.css"\n]', lang: 'json' }
      ] }
    ]
  },
  {
    slug: 'data-table',
    title: 'Angular data table: columns, filters, pagination',
    description: 'Configure lib-easy-table with EasyTableConfig and MatColumnTyped: typed columns, text and multi-select column filters, pagination, dialogs and a pinned header.',
    intro: 'lib-easy-table renders an Angular Material table from one EasyTableConfig object. Columns are described with MatColumnTyped.',
    blocks: [
      { h2: 'Configuration object', items: [
        { code: "new EasyTableConfig<Country>({\n  data: countries,\n  displayedColumns: columns,        // MatColumnTyped[]\n  withToolbar: true,                // search, add and clear buttons\n  withFilterInHeader: true,         // column filters under the titles\n  changePageSize: 10,\n  canCreate: true, canUpdate: true, canDelete: true,\n  sortedBy: '',                     // keep the order given by your service\n  rowKey: 'id',                     // property that identifies a row\n  dialog: { add: true, edit: true, view: true, mode: 'open', form: countryDialogForm }\n});", lang: 'typescript' },
        { p: 'Outputs of the component include dialogResult, deleteItem, extendRow, clickField, overwrite and the toolbar events.' }
      ] },
      { h2: 'Typed columns', items: [
        { code: "new MatColumnTyped({ name: 'code', type: ColumnType.IMAGE })               // flag from a country code (needs flag-icons)\nnew MatColumnTyped({ name: 'name', translateTitle: 'countries.name' })\nnew MatColumnTyped({\n  name: 'isCapital', type: ColumnType.ICON,\n  enableIcon: 'star', disableIcon: 'remove',\n  conditionFn: (row) => row.isCapital,\n  cssClassFn: (row) => (row.isCapital ? 'yellow' : 'grey')\n})\nnew MatColumnTyped({ name: 'actions', headerIcon: 'rule' })              // row buttons: view, edit, delete", lang: 'typescript' },
        { p: 'Column types: text, number, date, date-time, icon, icon-and-text, button, password, dropdownlist, image and filter.' }
      ] },
      { h2: 'Column filters', items: [
        { p: 'Turn on withFilterInHeader for the table and enableFilter on a column. filterType chooses the control: "text" is a compact input, "select" (the default) is a multi-select of the values found in the column.' },
        { code: "new MatColumnTyped({ name: 'name', enableFilter: true, filterType: 'text' })\nnew MatColumnTyped({ name: 'isoCode', enableFilter: true })   // multi-select of the values", lang: 'typescript' },
        { p: 'Every header cell reserves the same filter row, so titles stay aligned whether a column is filterable or not, and the header stays pinned while the rows scroll. Below 1024 px the filters fold away behind a filter button in the toolbar.' }
      ] },
      { h2: 'Selecting a row', items: [
        { p: 'A clicked row is highlighted. Rows are identified by the property named in rowKey (default id), so rows that share an id can be told apart and the selection survives a data reload.' }
      ] }
    ]
  },
  {
    slug: 'child-tables-and-tabs',
    title: 'Angular child tables, expandable rows and tabs',
    description: 'Show a child table when a row is expanded, or several child tables in tabs, with childConfig, isExpanded, tabTitle and tabIcon.',
    intro: 'A row of lib-easy-table can expand to reveal a child table, or several child tables in tabs.',
    blocks: [
      { h2: 'One child table', items: [
        { code: '<lib-easy-table\n  [config]="countryTable"\n  [childConfig]="cityTable"\n  (extendRow)="onExpand($event)"\n  (childDialogResult)="onCityDialogResult($event)"\n  (deleteChildItem)="onCityDelete($event)">\n</lib-easy-table>', lang: 'html' },
        { p: 'Set isExpanded: true on the parent configuration to get the expand button. extendRow emits the row that was opened (or null when it is closed): load its children there and build a new configuration for the child table.' },
        { code: "async onExpand(country: Country | null) {\n  this.cities = country ? await firstValueFrom(this.api.getCities(country.id)) : [];\n  this.cityTable = cityTable({ data: this.cities, title: 'Cities' }); // a new configuration refreshes the child table\n}", lang: 'typescript' }
      ] },
      { h2: 'Child tables in tabs', items: [
        { p: 'Pass an array to childConfig. Each configuration becomes a tab labelled by tabTitle (translated) with an optional tabIcon.' },
        { code: "this.tabs = [\n  new EasyTableConfig({ tabTitle: 'TABS.ALL', tabIcon: 'location_city', data: all, displayedColumns: columns }),\n  new EasyTableConfig({ tabTitle: 'TABS.TOP', tabIcon: 'trending_up', data: top, displayedColumns: columns })\n];", lang: 'typescript' },
        { p: 'childTabChange tells you which tab is active, so one dialog handler can route results to the right service. childConfig accepts configurations of any row type.' }
      ] }
    ]
  },
  {
    slug: 'multi-select',
    title: 'Angular multi-select dropdown component',
    description: 'Use lib-easy-multi-select: a searchable Angular Material multi-select with select-all, clear, read-only, form-field mode and a compact mode.',
    intro: 'lib-easy-multi-select is a standalone Angular Material multi-select with search and select-all.',
    blocks: [
      { h2: 'Usage', items: [
        { code: "import { Dictionary, EasyMultiSelect } from 'easy-mat-ui-ng20';\n\n@Component({\n  standalone: true,\n  imports: [EasyMultiSelect],\n  template: `\n    <lib-easy-multi-select\n      title=\"Countries\"\n      [data]=\"countries\"\n      valueField=\"key\"\n      displayField=\"value\"\n      [clearable]=\"true\"\n      (change)=\"selected = $event\">\n    </lib-easy-multi-select>`\n})\nexport class Demo {\n  countries = [new Dictionary('dz', 'Algeria'), new Dictionary('fr', 'France')];\n  selected: string[] = [];\n}", lang: 'typescript' }
      ] },
      { h2: 'Inputs and output', items: [
        { table: { head: ['Name', 'Description'], rows: [
          ['data', 'Items to choose from: Dictionary[] ({ key, value })'],
          ['title', 'Label (translated)'],
          ['valueField / displayField', 'Which property is emitted and which is shown (key or value)'],
          ['selectedData', 'Items selected at start'],
          ['clearable', 'Adds a button that empties the selection'],
          ['readOnly', 'Shows the selection without letting the user change it'],
          ['formField / appearance', 'Material form-field look: outline or fill'],
          ['placeholder', 'Text shown while nothing is selected'],
          ['compact', 'Dense 32 px field, used for column filters in table headers'],
          ['(change)', 'Emits the selected values (string[]) on every change']
        ] } }
      ] }
    ]
  },
  {
    slug: 'themes-dark-mode',
    title: 'Angular Material dark mode and CSS variable theming',
    description: 'Switch Easy Mat UI between light, dark and system themes at runtime with EasyThemeService and customize it with CSS variables.',
    intro: 'The library is themed with CSS variables. EasyThemeService switches between light, dark and the operating system preference without reloading the page.',
    blocks: [
      { h2: 'Switch the theme', items: [
        { code: "import { inject } from '@angular/core';\nimport { EasyThemeService } from 'easy-mat-ui-ng20';\n\nconst theme = inject(EasyThemeService);\ntheme.setTheme('dark');   // 'light' | 'dark' | 'system'\ntheme.toggle();\ntheme.theme();            // the applied theme, as a signal", lang: 'typescript' },
        { p: 'The service does nothing until you call it. In dark mode it adds the dark-theme class to body and sets a data-easy-theme attribute and the CSS color-scheme on html. Pass a storageKey through EASY_THEME_OPTIONS if you want the choice remembered.' }
      ] },
      { h2: 'Customize with CSS variables', items: [
        { code: ':root {\n  --color-primary-blue: #1f6f8b;\n  --text-color: #0f172a;\n  --card-bg: #ffffff;\n  --border-color: #e2e8f0;\n  --radius-md: 10px;\n}\nbody.dark-theme {\n  --card-bg: #1e293b;\n  --text-color: #f8fafc;\n}', lang: 'css' },
        { p: 'Other variables: --color-success, --color-warning, --color-danger, --color-info, --focus-ring, --disabled-bg, --shadow-sm, --shadow-md, --shadow-lg, --row-selected-bg and --table-header-bg.' }
      ] }
    ]
  },
  {
    slug: 'angular-compatibility',
    title: 'Angular version compatibility of Easy Mat UI',
    description: 'Which Angular versions easy-mat-ui-ng20 supports: Angular 20 officially, Angular 19 and 21 tested, Angular 18 and older not working.',
    intro: 'Each Angular major version has its own package. The first number of the package version is the Angular major it targets. Compatibility was tested by building and running the packaged library in clean applications.',
    blocks: [
      { h2: 'Compatibility', items: [
        { table: { head: ['Angular', 'Status', 'Details'], rows: [
          ['20', 'Supported', 'Package easy-mat-ui-ng20, peer range ^20.0.0.'],
          ['19 and 21', 'Works, not official', 'Builds and runs; install with --legacy-peer-deps.'],
          ['18', 'Does not work', 'The table fails at runtime with Material 18.'],
          ['16 and 17', 'Does not work', 'The build fails (the library needs @let, Angular 18.1 or later).']
        ] } },
        { p: 'A package for Angular 21 (easy-mat-ui-ng21) is planned.' }
      ] }
    ]
  }
];

const FAQ = [
  ['What is Easy Mat UI?', 'An open-source (MIT) Angular library built on Angular Material: one configuration object gives a data table with column filters, pagination, expandable rows, child tables and tabs, a dialog and a multi-select.'],
  ['How do I install it?', 'npm install easy-mat-ui-ng20 in an Angular 20 project, then import EasyTableComponent, EasyTableConfig and MatColumnTyped.'],
  ['Does it support dark mode?', 'Yes: EasyThemeService.setTheme("light" | "dark" | "system") switches at runtime; the themes are CSS variables you can override.'],
  ['Which Angular versions are supported?', 'Angular 20 officially (easy-mat-ui-ng20). Angular 19 and 21 build and run but are not official; 18 and older do not work.'],
  ['Is it free?', 'Yes, MIT license. Source: ' + GITHUB]
];

// ---- rendering ------------------------------------------------------------------------------------------------------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const url = (slug) => `${SITE}/docs/${slug}/`;

function htmlBlocks(page) {
  return page.blocks.map((b) => `<h2>${esc(b.h2)}</h2>\n` + b.items.map((it) => {
    if (it.p) return `<p>${esc(it.p)}</p>`;
    if (it.code) return `<pre tabindex="0"><code>${esc(it.code)}</code></pre>`;
    if (it.ul) return `<ul>${it.ul.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
    if (it.table) return `<div class="scroll"><table><thead><tr>${it.table.head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${it.table.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    return '';
  }).join('\n')).join('\n');
}

const CSS = `:root{color-scheme:light dark;--bg:#f4f7fb;--card:#fff;--text:#0f172a;--muted:#5b6b82;--line:#e2e8f0;--accent:#1f6f8b;--code:#f6f8fc}
@media (prefers-color-scheme:dark){:root{--bg:#0f172a;--card:#1e293b;--text:#f8fafc;--muted:#9aa8b6;--line:#334155;--accent:#8eb3c7;--code:#0b1220}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.65 Roboto,'Segoe UI',Arial,sans-serif}
header,footer{max-width:860px;margin:0 auto;padding:16px 20px;display:flex;flex-wrap:wrap;gap:8px 20px;align-items:center}
header a.brand{font-weight:700;color:var(--text);text-decoration:none;margin-right:auto}header a,footer a{color:var(--accent)}
main{max-width:860px;margin:0 auto;padding:8px 20px 32px}h1{font-size:2rem;line-height:1.2;margin:.4em 0}h2{margin-top:1.8em;font-size:1.35rem}
.lead{color:var(--muted);font-size:1.1rem}pre{background:var(--code);border:1px solid var(--line);border-radius:10px;padding:14px 16px;overflow:auto;font:.85rem/1.5 ui-monospace,Consolas,monospace}
code{font-family:ui-monospace,Consolas,monospace}table{border-collapse:collapse;width:100%}th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line);vertical-align:top}.scroll{overflow-x:auto}
nav.docs{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;padding:0;list-style:none}nav.docs a{display:block;padding:14px 16px;background:var(--card);border:1px solid var(--line);border-radius:12px;text-decoration:none;color:var(--text)}nav.docs small{display:block;color:var(--muted)}
a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}`;

function layout({ title, description, canonical, body, jsonld }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${esc(description)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${canonical}">
<link rel="icon" type="image/svg+xml" href="${SITE}/favicon.svg">
<meta property="og:type" content="article"><meta property="og:site_name" content="${NAME}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}"><meta property="og:image" content="${SITE}/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<style>${CSS}</style>
</head>
<body>
<header><a class="brand" href="${SITE}/">${NAME}</a><a href="${SITE}/">Live demo</a><a href="${SITE}/docs/">Docs</a><a href="${GITHUB}">GitHub</a><a href="${NPM}">npm</a></header>
<main>
${body}
</main>
<footer><span>MIT licensed. Package <code>easy-mat-ui-ng20</code>.</span><a href="${SITE}/llms.txt">llms.txt</a><a href="${GITHUB}">Source on GitHub</a></footer>
</body>
</html>
`;
}

function write(rel, content) {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

if (!fs.existsSync(OUT)) throw new Error('Build the demo first: ' + OUT + ' not found');

// 1. documentation pages
for (const page of PAGES) {
  const canonical = url(page.slug);
  const body = `<p><a href="${SITE}/docs/">Docs</a> / ${esc(page.title)}</p>\n<h1>${esc(page.title)}</h1>\n<p class="lead">${esc(page.intro)}</p>\n${htmlBlocks(page)}\n<p><a href="${SITE}/">Open the live demo</a> or read the <a href="${GITHUB}">source on GitHub</a>.</p>`;
  write(`docs/${page.slug}/index.html`, layout({
    title: `${page.title} | ${NAME}`, description: page.description, canonical, body,
    jsonld: {
      '@context': 'https://schema.org', '@type': 'TechArticle', headline: page.title, description: page.description, url: canonical,
      inLanguage: 'en', dateModified: TODAY, author: { '@type': 'Person', name: 'Redouane Chaibi', url: 'https://github.com/chaibiredouane' },
      isPartOf: { '@type': 'WebSite', name: NAME, url: SITE + '/' }
    }
  }));
}

const faqHtml = FAQ.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('\n');
write('docs/index.html', layout({
  title: `${NAME} documentation: Angular Material data table library`,
  description: 'Documentation of Easy Mat UI: install, data table, column filters, child tables and tabs, multi-select, themes and Angular compatibility.',
  canonical: `${SITE}/docs/`,
  body: `<h1>${NAME} documentation</h1>\n<p class="lead">An open-source Angular Material data table library. One configuration object gives you filters, pagination, child tables, tabs, dialogs, a multi-select and light and dark themes.</p>\n<nav><ul class="docs">${PAGES.map((p) => `<li><a href="${url(p.slug)}">${esc(p.title.split(':')[0])}<small>${esc(p.description)}</small></a></li>`).join('')}</ul></nav>\n<h2>Frequently asked questions</h2>\n${faqHtml}`,
  jsonld: {
    '@context': 'https://schema.org', '@type': 'FAQPage', url: `${SITE}/docs/`,
    mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
  }
}));

// 2. llms.txt and llms-full.txt (https://llmstxt.org)
const llms = `# ${NAME}

> Open-source (MIT) Angular library built on Angular Material. One configuration object gives a data table with column filters, pagination, expandable rows, child tables and tabs, a create/edit/view dialog, a multi-select, and light and dark themes. Package: easy-mat-ui-ng20 (Angular 20).

Easy Mat UI is maintained by Redouane Chaibi. Each Angular major version has its own npm package; the first number of the package version is the Angular version it targets.

## Documentation
${PAGES.map((p) => `- [${p.title}](${url(p.slug)}): ${p.description}`).join('\n')}

## Source and package
- [GitHub repository](${GITHUB}): source code, README, changelog, issues
- [npm package](${NPM}): easy-mat-ui-ng20
- [Live demo](${SITE}/): interactive demo with the source of every page

## Optional
- [Full documentation as one text file](${SITE}/llms-full.txt)
`;
write('llms.txt', llms);

const md = (page) => `## ${page.title}\n\n${page.intro}\n\n` + page.blocks.map((b) => `### ${b.h2}\n\n` + b.items.map((it) => {
  if (it.p) return it.p;
  if (it.code) return '```' + (it.lang || '') + '\n' + it.code + '\n```';
  if (it.ul) return it.ul.map((x) => `- ${x}`).join('\n');
  if (it.table) return `| ${it.table.head.join(' | ')} |\n| ${it.table.head.map(() => '---').join(' | ')} |\n` + it.table.rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
  return '';
}).join('\n\n')).join('\n\n');
write('llms-full.txt', `# ${NAME}: full documentation\n\n> Open-source (MIT) Angular library built on Angular Material. Package: easy-mat-ui-ng20. Source: ${GITHUB}. Demo: ${SITE}/\n\n${PAGES.map(md).join('\n\n')}\n\n## Frequently asked questions\n\n${FAQ.map(([q, a]) => `**${q}** ${a}`).join('\n\n')}\n`);

// 2b. 404 page (the app has no routes, so an unknown address must not answer 200)
write('404.html', layout({
  title: `Page not found | ${NAME}`,
  description: 'This page does not exist.',
  canonical: `${SITE}/`,
  body: `<h1>Page not found</h1><p class="lead">This address does not exist.</p><p><a href="${SITE}/">Open the live demo</a> or read the <a href="${SITE}/docs/">documentation</a>.</p>`,
  jsonld: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Page not found' }
}));
const notFound = path.join(OUT, '404.html');
fs.writeFileSync(notFound, fs.readFileSync(notFound, 'utf8').replace('<meta name="robots" content="index, follow, max-image-preview:large">', '<meta name="robots" content="noindex">'));

// 3. sitemap.xml and robots.txt
const urls = [`${SITE}/`, `${SITE}/docs/`, ...PAGES.map((p) => url(p.slug))];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u, i) => `  <url><loc>${u}</loc><lastmod>${TODAY}</lastmod><changefreq>${i === 0 ? 'weekly' : 'monthly'}</changefreq><priority>${i === 0 ? '1.0' : '0.7'}</priority></url>`).join('\n')}\n</urlset>\n`);

const bots = ['Googlebot', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'anthropic-ai', 'Google-Extended', 'Applebot', 'Applebot-Extended', 'CCBot', 'cohere-ai', 'Meta-ExternalAgent', 'Bytespider', 'DuckDuckBot', 'YandexBot'];
write('robots.txt', `# Easy Mat UI is open source: search engines and AI crawlers are welcome.\nUser-agent: *\nAllow: /\n\n${bots.map((b) => `User-agent: ${b}\nAllow: /`).join('\n\n')}\n\nSitemap: ${SITE}/sitemap.xml\n`);

// 4. real address in the files Angular produced
for (const rel of ['index.html', 'manifest.webmanifest']) {
  const file = path.join(OUT, rel);
  if (fs.existsSync(file)) fs.writeFileSync(file, fs.readFileSync(file, 'utf8').split('__SITE_URL__').join(SITE));
}
const left = fs.readFileSync(path.join(OUT, 'index.html'), 'utf8').includes('__SITE_URL__');
console.log(`site built for ${SITE}: ${PAGES.length} docs pages + index, llms.txt, llms-full.txt, sitemap.xml (${urls.length} urls), robots.txt` + (left ? ' | WARNING: unreplaced tokens' : ''));
