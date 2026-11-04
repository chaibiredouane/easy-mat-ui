# Changelog

All notable changes to this project are documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project
follows [Semantic Versioning](https://semver.org/) (see [Versioning](README.md#versioning)).

## [Unreleased]

### Added
- The `Release` workflow creates the GitHub release with the section of the version in `CHANGELOG.md` as its notes
  (`scripts/release-notes.cjs`, tested in the CI), and skips `npm publish` when that version is already on npm, so a
  run can be repeated. Before, the release was only created after a successful publish, with generated notes.
- Dependabot (`.github/dependabot.yml`): weekly pull requests for the npm dependencies and the GitHub Actions. The
  Angular packages update together, and a major update of the Angular packages, TypeScript, RxJS, ngx-translate,
  Bootstrap or flag-icons is left to a human.
- CodeQL (`.github/workflows/codeql.yml`): static analysis of the TypeScript and JavaScript code on every push and
  pull request, and every Monday.
- An `Audit` workflow (`npm audit --audit-level=high`) on every push and pull request, and every Monday. It is not a
  required check.

### Security
- The repository and the demo site now build with Angular 20.3.35, Angular Material and CDK 20.2.14 and the Angular CLI
  20.3.42 (they were on 20.3.9 and 20.2.9). This clears the high-severity advisories that `npm audit` reported for the
  Angular packages used to build the demo (the XSS, XSRF and denial-of-service issues fixed up to 20.3.25). `npm audit`
  now reports no critical and no high vulnerability, and none in production dependencies. The published package is
  unchanged: its peer dependency range stays `^20.0.0`, so applications keep choosing their own Angular version, and
  should be on a patched 20.3.x.

### Changed
- README: a logo, real screenshots and a short demonstration taken from the live demo, a one-paragraph summary of
  what the library is for, and a "Status and limits" section (young project, Angular 20, data handled in the browser,
  click-to-sort off with header filters). The screenshots and the logo are in `docs/images`.

## [20.0.6] - 2026-11-04

### Fixed
- `lib-easy-table` and `lib-easy-table-basic` no longer reorder the array they receive: they sort a copy. An array
  that is frozen or read-only (state frozen by a store, `Object.freeze`) used to throw `Cannot assign to read only
  property` when the table rendered it. (#15)
- The default sort (`sortedBy: 'id'`) orders numbers as numbers: ids 1 to 12 are shown as 1, 2, 3 ... 12 instead of
  1, 10, 11, 12, 2 ... 9. Text keeps being compared as text. Tables that rely on `sortedBy: ''` are not affected. (#16)
- The search field of the toolbar filters on every change of its value, not only on `keyup`. A new output,
  `searchInput`, of `lib-table-toolbar` carries the event; `applyFilterEvent` is unchanged. (#17)

## [20.0.5] - 2026-11-04

### Fixed
- README and install page: the install command now pins `@ngx-translate/core` and `@ngx-translate/http-loader` to
  version 16. Without the version, npm installs the latest major, which the library does not support, and
  `provideTranslateService({ defaultLanguage: 'en' })` fails to compile.

## [20.0.4] - 2026-11-04

### Added
- `examples/stackblitz-starter`: a minimal Angular 20 project (data table with filters and dialog, and the reusable
  components) that opens in StackBlitz with nothing to install; linked from the README and the documentation.

### Changed
- README: the Page builder of the demo and the `add-page` command are explained together (what each one does, how they
  share one generator, how to pass the description from one to the other, and what they do not do).

### Fixed
- Demo: the continent buttons no longer touch the table below them.

## [20.0.3] - 2026-11-04

### Added
- `MatColumnTyped.headerClass`: CSS class(es) for the header cell of one column, for example `text-center` to centre the
  title of an icon column (Actions, Flag), even in first position. It is applied to the header only, never to the cells,
  and is empty by default, so existing tables look as before.
  The demo uses it to centre the title of its flag and actions columns.

### Fixed
- Table on a phone: the first column title was cut at its right edge; it now has room on the right.
- The README shown on npm had broken "Live demo" and "Documentation" links (a placeholder was left in); they now point to
  https://easy-mat-ui.web.app.

### Changed
- npm description, keywords and homepage (the live demo) describe the library more precisely.
- Documentation: five pages written around common searches (Angular Material table, filters and pagination, reusable
  components, page generator, library comparison), a longer FAQ and guidance for AI assistants in `llms.txt`.
- `check:examples` compiles the code samples of the documentation in CI.

## [20.0.2] - 2026-11-04

### Added
- Reusable interface components, each with `@Input()` / `@Output()` and a typed model:
  `lib-easy-segmented` (a group of buttons of which one is chosen, as a setting or as tabs),
  `lib-easy-chip-nav` (buttons with icon, colour and count to browse by category),
  `lib-easy-language-switch` (menu or inline, flag / name / code; independent of any translation library),
  `lib-easy-card` and `lib-easy-card-grid` (cards with icon, title, description, actions; responsive grid),
  `lib-easy-stat` (a key figure) and `lib-easy-page-header` (icon, title, subtitle and a slot for controls).
- `easy-mat-ui add-page` command (`npx easy-mat-ui add-page`): generates an Angular page from these components and from
  the table, as a component, a template, a table configuration and models. Components can be used alone or combined
  with a table and a child table. It reuses an existing `*.model.ts` that matches the page name or generates a generic
  one (`item1`, `item2`, `item3`), and it either writes translation keys (and adds them to the English file) or plain
  texts: it never installs a translation library. `--dry-run`, `--config` and `--help` are available.

### Fixed
- Table toolbar on a phone: the search field and the action buttons stay on one line (the search field gives up width)
  instead of the buttons dropping under it.

## [20.0.1] - 2026-11-04

### Added
- `lib-easy-multi-select`: `single` input for a single-choice dropdown (no checkboxes, no select all). `change` still
  emits an array, holding the chosen value.

### Changed
- `lib-easy-multi-select` follows later changes of its `data` and `selectedData` inputs (a filtered list, a selection
  set by the parent), instead of reading them only once.

## [20.0.0] - 2026-11-03

First release of the `easy-mat-ui-ng20` package, aligned with Angular 20.

### Added
- `lib-easy-table` and `lib-easy-table-basic`: data tables with filtering, sorting, pagination, grouped
  columns, expandable rows, tabbed child tables and a toolbar.
- **Column filters in the header**: `MatColumnTyped.filterType` (`'text'` input or `'select'` multi-select, the default),
  shown with `withFilterInHeader` + `enableFilter`. Below 1024 px they fold away behind a filter button in the toolbar.
- Header that stays pinned while the rows scroll; every column keeps the same header structure whether it is
  filterable or not (titles and filters are aligned). `--easy-table-max-height` sets the scroll height (default `75vh`).
- `EasyTableConfig.rowKey`: property that identifies a row for the selection highlight (default `id`).
- `lib-easy-multi-select`: multi-select control, with `placeholder` and `compact` inputs.
- `EasyDialogService` / `lib-easy-dialog`: configurable create / edit / view dialog.
- `lib-confirm-dialog` and `lib-table-toolbar`.
- `EasyThemeService` (`setTheme('light' | 'dark' | 'system')`, `toggle()`, `mode` / `theme` signals) and `EASY_THEME_OPTIONS`.
- A new light theme and the existing dark theme, both driven by CSS variables. Design tokens:
  `--color-success/warning/danger/info`, `--focus-ring`, `--disabled-bg/-text`, `--radius-sm/md/lg`,
  `--shadow-sm/md/lg`, `--on-accent`, `--color-primary-blue-strong`, `--row-selected-bg`, `--table-header-bg`.
- `EasyPaginatorIntl` and `provideEasyPaginatorIntl()`: paginator labels read through ngx-translate.
- Shared models, enums and configuration classes exported from the package entry point.
- Optional global stylesheet shipped under `styles/`.
- Runnable demo application (`projects/demo`) and documentation pages, not published to npm.

### Changed
- Light theme redesigned (deep teal-blue identity, slate neutrals, soft surfaces and borders, uppercase table headers).
  The dark theme is unchanged, except that the selected row is now readable (it was white text on light grey).
- Tables use automatic column widths: data columns share the available width and the actions column shrinks to its
  buttons (it used to take hundreds of pixels on wide screens). Below 768 px the sticky actions column stays compact.
- Default `enableColor` / `disableColor` of a column are now `green` / `red`, CSS classes provided by the shipped
  stylesheet; the `.bg-*` utilities follow the theme variables.
- `childConfig` accepts configurations of any row type (`EasyTableConfig<any>`), so child tables no longer have to share
  the parent's type.
- The child-tab active color follows `--tab-active-bg` (teal-blue in light, `#2e7d32` in dark: white text reaches at
  least 5:1 contrast).
- The toolbar table title is a `div role="heading" aria-level="2"` instead of an `h6`.
- The paginator text uses `--color-primary-blue-strong` (4.6:1 on white instead of 3.2:1).
- The simple table (`lib-easy-table-basic`) has the same alternating row colors as `lib-easy-table`.
- `lib-easy-table` and `lib-easy-table-basic` clip sideways overflow, so no stray scrollbar appears around them.

### Fixed
- The toolbar search box lost characters while typing when `eventCoalescing` was enabled (the Angular default): a stale
  value was written back into the input. The filter text is now kept apart from the bound field, so the text you type is
  never rewritten (it is also no longer forced to lower case in the box).
- The header-filter dropdown of `lib-easy-multi-select` had no accessible name.
- Hidden header filters kept reserving 200 px, which made every column at least that wide.
- Narrow screens: the sticky actions column could cover the whole table.
- Rows sharing the same `id` were all highlighted when one was selected (use `rowKey`).

### Known limitations
- Two components embed the Bootstrap stylesheet, so a new Angular project exceeds the default initial bundle budget (1 MB):
  raise it as described in the README (a slimmer stylesheet is planned).
- Angular 19 and 21 build and run but are not officially supported; Angular 18 and older do not work.
- `InputType.Checkbox` exists but the dialog renders a text field for it; there is no radio, e-mail or icon field.
- The CSV export button of the toolbar (`canExport`) only logs to the console.
- Sorting a column that displays a derived text sorts that text.
