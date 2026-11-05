// Generates pages with the `easy-mat-ui add-page` command and compiles them with the Angular compiler (strict templates).
// It proves that what the generator writes is valid code for the current components of the library.
// Run `npm run build` first: the command is the one built into dist/easy-mat-ui/page-generator.
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const cli = path.join(root, 'dist/easy-mat-ui/page-generator/cli/main.js');
const ngc = path.join(root, 'node_modules/@angular/compiler-cli/bundles/src/bin/ngc.js');
const work = path.join(root, 'projects/demo/src/app/_generated-check');
const tsconfig = path.join(root, 'projects/demo/tsconfig.generated-check.json');
const relative = (file) => path.relative(root, file).split(path.sep).join('/');

if (!fs.existsSync(cli)) {
  console.error('The command is not built: run `npm run build` first.');
  process.exit(1);
}

const clean = () => {
  fs.rmSync(work, { recursive: true, force: true });
  fs.rmSync(tsconfig, { force: true });
};

const generate = (...args) => execFileSync(process.execPath, [cli, 'add-page', '--dir', relative(work), ...args], { cwd: root, stdio: 'pipe' });

try {
  clean();
  fs.mkdirSync(path.join(work, 'models'), { recursive: true });
  fs.mkdirSync(path.join(work, 'i18n'), { recursive: true });
  // An existing model, with a property that cannot be a column (a list).
  fs.writeFileSync(
    path.join(work, 'models/stock-item.model.ts'),
    "export class StockItem {\n  id = 0;\n  name = '';\n  quantity = 0;\n  received: Date | null = null;\n  isActive = true;\n  tags: string[] = [];\n}\n"
  );
  fs.writeFileSync(path.join(work, 'i18n/en.json'), '{\n  "EXISTING": "kept"\n}\n');

  const all = 'page-header,stat,chip-nav,segmented,language-switch,card-grid,table';
  generate('--name', 'all-plain', '--blocks', all, '--no-i18n');
  generate('--name', 'all-i18n', '--blocks', all, '--i18n', '--i18n-dir', relative(path.join(work, 'i18n')));
  generate('--name', 'with-child', '--blocks', 'page-header,table', '--child', '--no-i18n');
  generate('--name', 'stock-items', '--blocks', 'page-header,table', '--no-i18n'); // reuses stock-item.model.ts
  generate('--name', 'read-only', '--blocks', 'table', '--no-i18n', '--table-model', 'generic');

  fs.writeFileSync(
    tsconfig,
    JSON.stringify({ extends: '../../tsconfig.json', compilerOptions: { noEmit: true, rootDir: '../..', types: [], resolveJsonModule: true }, include: ['src/app/_generated-check/**/*.ts'] }, null, 2)
  );
  try {
    execFileSync(process.execPath, [ngc, '-p', tsconfig], { cwd: root, stdio: 'pipe' });
  } catch (error) {
    process.stdout.write(String(error.stdout ?? '') + String(error.stderr ?? ''));
    throw new Error('The generated pages do not compile.');
  }
  const en = JSON.parse(fs.readFileSync(path.join(work, 'i18n/en.json'), 'utf8'));
  if (en.EXISTING !== 'kept' || !en.PAGES?.ALL_I18N || en.SEARCH !== 'Search') throw new Error('The translation file was not updated as expected.');
  console.log('Generated pages compile: all components with and without translations, child table, existing model, generic model.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  clean();
}
