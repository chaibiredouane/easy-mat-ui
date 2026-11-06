#!/usr/bin/env node
// Prints the notes of a GitHub release: the section of one version in CHANGELOG.md, then how to install it.
//   node scripts/release-notes.cjs 20.0.6 [path/to/CHANGELOG.md]
// It fails when the version has no section (or an empty one), so that a release cannot be published without notes.
const fs = require('fs');
const path = require('path');

const REPO = 'https://github.com/chaibiredouane/easy-mat-ui';

/** The heading and the body of the `## [version]` section, or null when there is none. */
function section(changelog, version) {
  const lines = changelog.split(/\r?\n/);
  const escaped = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const start = lines.findIndex((line) => new RegExp(`^## \\[${escaped}\\]( |$)`).test(line));
  if (start < 0) return null;
  let end = lines.findIndex((line, i) => i > start && /^## \[/.test(line));
  if (end < 0) end = lines.length;
  return { heading: lines[start], body: lines.slice(start + 1, end).join('\n').trim() };
}

function notes(changelog, version, packageName = 'easy-mat-ui') {
  if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) {
    throw new Error(`"${version}" is not a version such as 20.0.6.`);
  }
  const found = section(changelog, version);
  if (!found) throw new Error(`CHANGELOG.md has no section "## [${version}]". Add it before tagging v${version}.`);
  if (!found.body) throw new Error(`The section of ${version} in CHANGELOG.md is empty.`);
  const angular = packageName.match(/ng(\d+)$/);
  const requirements = `${REPO}#requirements-and-supported-versions`;
  // A name with an -ngN suffix targets one Angular major; the unsuffixed name covers every major of the peer range.
  const support = angular
    ? ` (Angular ${angular[1]}; see the [requirements](${requirements}))`
    : ` (Angular 20, 21 and 22; see the [requirements](${requirements}))`;
  return [
    found.body,
    '',
    '---',
    '',
    `**Install:** \`npm install ${packageName}@${version}\`${support}.`,
    '',
    `**Full changelog:** ${REPO}/blob/main/CHANGELOG.md`,
    ''
  ].join('\n');
}

module.exports = { section, notes };

if (require.main === module) {
  const [version, file] = process.argv.slice(2);
  try {
    if (!version) throw new Error('Usage: node scripts/release-notes.cjs <version> [CHANGELOG.md]');
    const changelog = fs.readFileSync(file || path.join(__dirname, '..', 'CHANGELOG.md'), 'utf8');
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'projects', 'easy-mat-ui', 'package.json'), 'utf8'));
    process.stdout.write(notes(changelog, version, pkg.name));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
