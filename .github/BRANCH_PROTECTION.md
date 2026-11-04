# Branch protection (recommended settings)

For maintainers. These settings make the workflow of [CONTRIBUTING.md](../CONTRIBUTING.md) hold even when someone
forgets it: nothing reaches `main` or `develop` without a pull request and a green CI.

Set them up in **Settings → Rules → Rulesets → New ruleset → New branch ruleset** (or **Settings → Branches** with
classic protection rules). Do it **after** both branches exist on GitHub and are in sync.

## 1. Default branch

**Settings → General → Default branch → `develop`.** Pull requests then target `develop` by default, which is where
contributors should send them. `main` stays the stable branch.

## 2. `main`: protected

Target branch: `main`.

| Setting | Value |
| --- | --- |
| Restrict deletions | On |
| Block force pushes | On |
| Require a pull request before merging | On. Approvals: `0` while you are the only maintainer, `1` once there are two |
| Require status checks to pass | On, with the check **`build-and-test`** (the job of `.github/workflows/ci.yml`) |
| Require branches to be up to date | Optional. Safer, but asks for more rebases |
| Bypass list | Empty. Keep the repository admin in it only if you need to unblock yourself |

This forbids direct pushes. Anything, including a release or a hotfix, goes through a pull request.

## 3. `develop`: lighter

Target branch: `develop`.

| Setting | Value |
| --- | --- |
| Restrict deletions | On |
| Block force pushes | On |
| Require a pull request before merging | On, approvals `0` |
| Require status checks to pass | On, **`build-and-test`** |

## 4. Repository settings

**Settings → General → Pull Requests:**

- Allow **squash merging** (for `feature/*` and `fix/*` into `develop`) and **merge commits** (for everything into
  `main`). Rebase merging can stay off.
- **Automatically delete head branches**: On, so merged work branches disappear by themselves.

## Notes

- The check `build-and-test` only appears in the list once the workflow has run on a pull request. Open a first one,
  then add the rule.
- `ng<major>` maintenance branches (see CONTRIBUTING.md) deserve the same rules as `develop`. Add the pattern
  `ng[0-9]*` to the ruleset.
