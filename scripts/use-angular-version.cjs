// Points the workspace devDependencies at an Angular major, to check that the library still builds and passes
// its tests with it. It rewrites package.json (do not commit that change). With --install it also runs the
// install with the options Angular 21 and 22 need: a plain `npm install` stops on peer dependency conflicts
// against the Angular 20 package-lock.json.
//   node scripts/use-angular-version.cjs 22 --install
// Back to Angular 20:  git checkout -- package.json  then  npm ci
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const major = process.argv[2];
const install = process.argv.includes('--install');
if (!/^\d+$/.test(major || '')) {
  console.error('Usage: node scripts/use-angular-version.cjs <angular major> [--install]');
  process.exit(1);
}

// The TypeScript range each Angular major requires.
const TYPESCRIPT = { 21: '~5.9.3', 22: '~6.0.0' };

const root = path.join(__dirname, '..');
const file = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
const dev = pkg.devDependencies;

for (const name of Object.keys(dev)) {
  if (name.startsWith('@angular/') || name === 'ng-packagr') {
    dev[name] = `^${major}.0.0`;
    console.log(`${name} ${dev[name]}`);
  }
}
if (TYPESCRIPT[major]) dev.typescript = TYPESCRIPT[major];

fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n');

if (install) {
  // --no-package-lock keeps package-lock.json (Angular 20) untouched. --before ignores releases less than a day old:
  // a new Angular release is sometimes visible on npm before all of its packages are, and the install then fails
  // with ETARGET.
  const before = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  execSync(`npm install --legacy-peer-deps --no-package-lock --no-audit --no-fund --before=${before}`, { stdio: 'inherit', cwd: root });
  console.log(`\nInstalled Angular ${major}. Build, test and serve as usual (npm run build, npm test, npm start).`);
  console.log('Back to Angular 20:  git checkout -- package.json  then  npm ci');
}
