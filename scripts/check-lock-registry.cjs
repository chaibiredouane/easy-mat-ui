// Fails when package-lock.json downloads a package from anywhere but the public npm registry.
// A dependency added or updated from a machine configured with a private registry mirror writes that mirror's
// address in the lock file, and `npm ci` then fails on every machine that cannot reach it (the CI, contributors).
// To fix it, install with `--registry=https://registry.npmjs.org/` or replace the address in the lock file.
const fs = require('node:fs');
const path = require('node:path');

const PUBLIC_HOST = 'registry.npmjs.org';
const lock = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package-lock.json'), 'utf8'));

const offenders = Object.entries(lock.packages || {})
  .filter(([, entry]) => entry.resolved && new URL(entry.resolved).host !== PUBLIC_HOST)
  .map(([name, entry]) => `  ${name || '(root)'}: ${entry.resolved}`);

if (offenders.length) {
  console.error(`package-lock.json uses a registry other than ${PUBLIC_HOST} for ${offenders.length} package(s):`);
  console.error(offenders.join('\n'));
  console.error('Install with --registry=https://registry.npmjs.org/ or replace the address in the lock file.');
  process.exit(1);
}
console.log(`package-lock.json: every package is downloaded from ${PUBLIC_HOST}.`);
