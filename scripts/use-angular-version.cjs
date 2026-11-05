// Points the workspace devDependencies at an Angular major, to check that the library still builds and passes
// its tests with it. It only rewrites package.json: run `npm install` afterwards (npm picks the newest release
// of that major).
//   node scripts/use-angular-version.cjs 21
const fs = require('node:fs');
const path = require('node:path');

const major = process.argv[2];
if (!/^\d+$/.test(major || '')) {
  console.error('Usage: node scripts/use-angular-version.cjs <angular major>');
  process.exit(1);
}

// The TypeScript range each Angular major requires.
const TYPESCRIPT = { 21: '~5.9.3', 22: '~6.0.0' };

const file = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
const dev = pkg.devDependencies;

for (const name of Object.keys(dev)) {
  if (name.startsWith('@angular/') || name === '@angular-devkit/build-angular' || name === 'ng-packagr') {
    dev[name] = `^${major}.0.0`;
    console.log(`${name} ${dev[name]}`);
  }
}
if (TYPESCRIPT[major]) dev.typescript = TYPESCRIPT[major];

fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n');
