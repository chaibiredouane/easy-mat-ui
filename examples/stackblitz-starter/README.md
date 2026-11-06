# Easy Mat UI starter

The smallest Angular 20 project that uses [easy-mat-ui](https://github.com/chaibiredouane/easy-mat-ui).
It has two examples:

- **Data table** (`src/app/users-table.ts`): a table with text and multi-select column filters, pagination, an icon
  column, view / edit / delete buttons and a create / edit / view dialog, described by one `EasyTableConfig` object.
- **Reusable components** (`src/app/toolbox.ts`): page header, key figures, category buttons, segmented control,
  language picker and card grid.

## Open it online (nothing to install)

https://stackblitz.com/github/chaibiredouane/easy-mat-ui/tree/main/examples/stackblitz-starter

## Run it on your machine

```bash
npm install
npm start      # http://localhost:4200
```

## What to look at

| File | Role |
|---|---|
| `src/app/app.config.ts` | One provider for ngx-translate, one for the paginator |
| `src/app/users-table.ts` | The whole table: columns, filters, dialog, events |
| `src/app/toolbox.ts` | The six reusable components with typed inputs |
| `angular.json` | The two stylesheets of the library (and `flag-icons`) |

The data lives in memory, so create, edit and delete work but reset on reload. Replace the lines marked in
`users-table.ts` with a call to your service when the data comes from an API.

Docs: https://easy-mat-ui.web.app/docs/ · Page generator: `npx easy-mat-ui add-page`
