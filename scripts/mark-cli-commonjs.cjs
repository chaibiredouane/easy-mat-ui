// The page generator CLI is compiled to CommonJS. ng-packagr 21 and later write `"type": "module"` in the
// package.json of dist/easy-mat-ui, which would make Node read the CLI as ES modules and fail
// ("exports is not defined in ES module scope"). A package.json next to the CLI keeps it CommonJS whatever
// ng-packagr version built the package.
const fs = require('node:fs');
const path = require('node:path');

const dir = path.join(__dirname, '..', 'dist', 'easy-mat-ui', 'page-generator');
fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ type: 'commonjs' }, null, 2) + '\n');
