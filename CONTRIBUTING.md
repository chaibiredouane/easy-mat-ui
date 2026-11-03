# Contributing

Thanks for your interest in improving easy-mat-ui.

## Setup

```bash
git clone https://github.com/chaibiredouane/easy-mat-ui.git
cd easy-mat-ui
npm ci
npm run build
npm test
```

Tests run with Karma in headless Chrome (`CHROME_BIN` must point to a Chrome/Chromium binary if it is not
installed in a default location).

## Workflow

1. Open an issue to discuss larger changes first.
2. Create a branch from `main`.
3. Keep changes focused; add or update tests.
4. Make sure `npm run build` and `npm test` pass.
5. Open a pull request describing what changed and why.

## Guidelines

- Do not rename or remove public selectors, inputs, outputs, models or enums in a minor or patch release.
  Breaking changes require a major version and a changelog entry.
- Everything public must be exported through `projects/easy-mat-ui/src/public-api.ts`.
- Update `CHANGELOG.md` for user-visible changes.

## Branches and Angular versions

`main` tracks the newest supported Angular line. Older lines are maintained on `ng<major>` branches
(for example `ng20`). Fixes are applied on `main` first and cherry-picked where relevant.

By contributing you agree that your contributions are licensed under the MIT License.
