# Contributing

Thanks for your interest in improving easy-mat-ui. Every contribution is welcome: a bug report, a typo, a new
language for the demo, a feature. You do not need to know the project yet, this page explains how it works.

## Setup

```bash
git clone https://github.com/chaibiredouane/easy-mat-ui.git
cd easy-mat-ui
npm ci
npm run build
npm test
```

Tests run with Karma in headless Chrome (`CHROME_BIN` must point to a Chrome/Chromium binary if it is not
installed in a default location). `npm start` runs the demo application.

## Branches

Two branches live forever, the others are short-lived and deleted once merged.

| Branch | Role |
| --- | --- |
| `main` | Stable. Only tested code that is ready to be published. Every release is tagged here. |
| `develop` | Where work comes together. New features and fixes land here first. |
| `feature/*` | A new feature. Starts from `develop`, merged back into `develop`. |
| `fix/*` | A bug fix. Starts from `develop`, merged back into `develop`. |
| `hotfix/*` | An urgent fix for a published version. Starts from `main`, merged into `main`, then into `develop`. |
| `release/*` | Optional, to prepare a release (version number, changelog). Starts from `develop`, merged into `main`. |

```text
main     ●─────────────────────●───────────●──── tag v20.1.0
          \                   / \         /
develop    ●───●───●───●───●─●───●───●───●
                \     /
feature/x        ●───●          (pull request into develop)
```

## Propose a change

**Always start from `develop`**, except for a hotfix (see [Releases and hotfixes](#releases-and-hotfixes)).

1. **Talk first for anything big.** [Open an issue](https://github.com/chaibiredouane/easy-mat-ui/issues/new/choose)
   to describe the bug or the idea. Small fixes can go straight to a pull request.
2. **Get your own copy.** Click **Fork** on GitHub, then:

   ```bash
   git clone https://github.com/<your-username>/easy-mat-ui.git
   cd easy-mat-ui
   git remote add upstream https://github.com/chaibiredouane/easy-mat-ui.git
   npm ci
   ```

   Maintainers with write access skip the fork and clone the main repository directly.

3. **Create a branch from an up-to-date `develop`.**

   ```bash
   git fetch upstream
   git checkout -b feature/column-resize upstream/develop
   ```

   For a bug fix, use `fix/` instead: `git checkout -b fix/filter-keeps-old-page upstream/develop`.

4. **Make your change.** Keep it focused, add or update tests, and run the [checks](#before-you-submit).
5. **Commit and push.**

   ```bash
   git add projects/easy-mat-ui/src/lib/easy-table
   git commit -m "Add column resize to lib-easy-table"
   git push -u origin feature/column-resize
   ```

6. **Open a pull request** from your branch into **`develop`** and fill in the template. CI runs automatically
   and must pass. A maintainer reviews it, you may be asked for changes: push more commits to the same branch.
7. **Merge.** The maintainer squashes your commits into one on `develop`. You can then delete your branch.

To catch up with `develop` while you work:

```bash
git fetch upstream
git rebase upstream/develop
git push --force-with-lease
```

## Naming

- **Branches**: `type/short-description`, lowercase, words separated by hyphens. An issue number helps:
  `feature/42-column-resize`, `fix/17-filter-keeps-old-page`, `hotfix/crash-on-empty-table`, `release/20.1.0`.
- **Commits and pull request titles**: a short sentence in the imperative, under 72 characters, starting with a
  capital letter: `Fix paginator label in Arabic`. Add `Fixes #17` in the description to close an issue.

## Before you submit

- `npm run build` and `npm test` pass.
- New behaviour has a test; a bug fix has a test that fails without the fix.
- Public API changes are exported through `projects/easy-mat-ui/src/public-api.ts`.
- User-visible changes are written under `## [Unreleased]` in `CHANGELOG.md`.
- Do not rename or remove public selectors, inputs, outputs, models or enums in a minor or patch release.
  Breaking changes require a major version and a changelog entry.
- If you changed what users see, check the demo (`npm start`) in the light and the dark theme.
- If you changed the page generator (`tools/page-generator`), run `npm run test:generator`, then `npm run build` and
  `npm run check:generated`: the second one generates pages and compiles them with the Angular compiler.

## Releases and hotfixes

For maintainers.

**Release.** When `develop` is ready, open a pull request from `develop` into `main` and merge it with a
**merge commit** (not a squash, so both branches keep the same history). If the version number and the changelog
need preparing, do it first on a branch:

```bash
git checkout -b release/20.1.0 origin/develop
# set "version" in projects/easy-mat-ui/package.json, then rename "Unreleased" to "[20.1.0]" in CHANGELOG.md
git commit -am "Prepare 20.1.0"
git push -u origin release/20.1.0      # pull request into main
```

After the merge, tag `main`. The `Release` workflow then tests and publishes the package to npm, and the
`Deploy site` workflow publishes the demo from `main`.

```bash
git checkout main && git pull
git tag v20.1.0 && git push origin v20.1.0
```

Finish with a pull request from `main` into `develop`, so that `develop` receives the release commit.

**Hotfix.** An urgent problem in the published version is fixed from `main`:

```bash
git checkout -b hotfix/crash-on-empty-table origin/main
# fix, commit, push, then open a pull request into main and release as above
```

Then open a pull request from `main` into `develop`, so the fix is not lost.

The recommended GitHub settings for these branches are in [.github/BRANCH_PROTECTION.md](.github/BRANCH_PROTECTION.md).

## Angular versions

`main` tracks the newest supported Angular line. When it moves to a newer Angular major, the previous line is kept on
an `ng<major>` branch (for example `ng20`) and still receives fixes. Fixes are made on `develop` first and
cherry-picked where relevant: `git cherry-pick -x <commit>`.

By contributing you agree that your contributions are licensed under the MIT License.
