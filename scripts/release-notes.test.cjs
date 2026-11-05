const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { section, notes } = require('./release-notes.cjs');

const CHANGELOG = [
  '# Changelog',
  '',
  '## [Unreleased]',
  '',
  '### Added',
  '- Something not released yet.',
  '',
  '## [20.0.2] - 2026-11-04',
  '',
  '### Fixed',
  '- The second fix.',
  '',
  '## [20.0.1] - 2026-11-03',
  '',
  '### Added',
  '- The first feature.',
  ''
].join('\n');

test('takes the body of a version and stops at the next heading', () => {
  const found = section(CHANGELOG, '20.0.2');
  assert.match(found.body, /The second fix/);
  assert.doesNotMatch(found.body, /first feature|not released yet/);
});

test('the last section runs to the end of the file', () => {
  assert.match(section(CHANGELOG, '20.0.1').body, /The first feature/);
});

test('does not mistake one version for another, and escapes the dots', () => {
  assert.equal(section(CHANGELOG, '20.0.3'), null);
  assert.equal(section(CHANGELOG, '20x0x2'), null);
});

test('reads a changelog with Windows line endings', () => {
  assert.match(section(CHANGELOG.replace(/\n/g, '\r\n'), '20.0.2').body, /The second fix/);
});

test('fails with a clear message when the section is missing or empty', () => {
  assert.throws(() => notes(CHANGELOG, '20.0.9'), /no section "## \[20\.0\.9\]"/);
  assert.throws(() => notes('## [20.0.9] - 2026-11-04\n\n## [20.0.8]\n- x\n', '20.0.9'), /empty/);
});

test('refuses something that is not a version', () => {
  assert.throws(() => notes(CHANGELOG, 'Unreleased'), /not a version/);
  assert.throws(() => notes(CHANGELOG, ''), /not a version/);
});

test('adds the install line and the link to the changelog', () => {
  const text = notes(CHANGELOG, '20.0.2', 'easy-mat-ui-ng20');
  assert.match(text, /npm install easy-mat-ui-ng20@20\.0\.2/);
  assert.match(text, /Angular 20/);
  assert.match(text, /CHANGELOG\.md/);
});

test('the real changelog has a section for the version of the package', () => {
  const root = path.join(__dirname, '..');
  const version = JSON.parse(fs.readFileSync(path.join(root, 'projects', 'easy-mat-ui', 'package.json'), 'utf8')).version;
  const text = notes(fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8'), version);
  assert.ok(text.length > 80);
});
