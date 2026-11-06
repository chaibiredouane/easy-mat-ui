#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline/promises';
import { BLOCK_CATALOG, BLOCK_CATEGORIES, defaultBlock, genericChildModel } from '../catalog';
import { generatePage } from '../generate';
import { kebab, singular, title } from '../naming';
import { Block, BlockType, ModelSpec, PageConfig, TableBlock } from '../types';
import {
  defaultPagesDirectory,
  detectLibrary,
  findModelFiles,
  findProjectRoot,
  findTranslationFile,
  parseModel,
  planTranslations,
  readJson,
  toPosix,
  usesNgxTranslate
} from './project';

const USAGE = `Generates an Angular page from the components of easy-mat-ui.

Usage: npx easy-mat-ui add-page [options]

Options:
  --name <name>            page name in kebab-case (asked when missing)
  --dir <folder>           destination folder, relative to the project (default: src/app/pages)
  --blocks <list>          components, separated by commas. Available:
                           ${BLOCK_CATALOG.map((b) => b.type).join(', ')}
  --table-model <name>     model of the table: a name (stock-item), a path, or "generic".
                           Without it, a model that matches the page name is reused, else a generic one is generated
  --child                  add a second table opened under a row, with a generic model
  --child-model <name>     add a second table with this existing model
  --i18n / --no-i18n       with translation keys (ngx-translate), or with plain texts.
                           Default: keys when @ngx-translate/core is installed
  --i18n-dir <folder>      folder of the translation files (default: public/assets/i18n or src/assets/i18n)
  --i18n-root <KEY>        first part of the translation keys (default: PAGES)
  --prefix <prefix>        prefix of the selector (default: the one of angular.json, or app)
  --lib <package>          package to import from (default: the installed one, easy-mat-ui)
  --config <file.json>     a complete page description, for example exported by the Builder of the demo
  --dry-run                show what would be done, write nothing
  --print                  with --dry-run, show the content of the files
  --help                   show this help

Missing answers are asked interactively. Nothing is ever installed.`;

type Flags = Record<string, string | boolean>;

function parseArguments(argv: string[]): { flags: Flags; positional: string[] } {
  const flags: Flags = {};
  const positional: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--no-')) {
      flags[arg.slice(5)] = false;
    } else if (arg.startsWith('--')) {
      const next = argv[i + 1];
      const hasValue = next !== undefined && !next.startsWith('--');
      flags[arg.slice(2)] = hasValue ? next : true;
      if (hasValue) i++;
    } else {
      positional.push(arg);
    }
  }
  return { flags, positional };
}

const text = (flags: Flags, key: string): string | undefined => (typeof flags[key] === 'string' ? (flags[key] as string) : undefined);

// ---- questions ---------------------------------------------------------------------------------------------------------

function createPrompter() {
  const reader = readline.createInterface({ input: process.stdin });
  const lines = reader[Symbol.asyncIterator]();
  const ask = async (question: string, fallback = ''): Promise<string> => {
    process.stdout.write(`${question}${fallback ? ` [${fallback}]` : ''}: `);
    const { value, done } = await lines.next();
    if (done) throw new Error('Input interrupted.');
    return String(value).trim() || fallback;
  };
  const askRequired = async (question: string): Promise<string> => {
    for (;;) {
      const answer = await ask(question);
      if (answer) return answer;
      console.log('  This value is required.');
    }
  };
  const askYesNo = async (question: string, fallback: 'y' | 'n'): Promise<boolean> =>
    ['y', 'yes'].includes((await ask(`${question} (y/n)`, fallback)).toLowerCase());
  const choose = async (question: string, options: string[]): Promise<number> => {
    options.forEach((option, index) => console.log(`  ${index + 1}. ${option}`));
    for (;;) {
      const index = Number(await ask(question, '1')) - 1;
      if (options[index]) return index;
    }
  };
  const close = () => {
    reader.close();
    process.stdin.destroy();
  };
  return { ask, askRequired, askYesNo, choose, close };
}
type Prompter = ReturnType<typeof createPrompter>;

/** The menu of components, by category; the answer is a list of numbers. */
async function askBlocks(prompter: Prompter): Promise<BlockType[]> {
  console.log('\nComponents of the page:');
  const numbered: BlockType[] = [];
  for (const category of BLOCK_CATEGORIES) {
    const group = BLOCK_CATALOG.filter((block) => block.category === category);
    if (!group.length) continue;
    console.log(`  ${category}`);
    for (const block of group) {
      numbered.push(block.type);
      console.log(`    ${String(numbered.length).padStart(2)}. ${block.label}: ${block.description}`);
    }
  }
  const defaults = [numbered.indexOf('page-header') + 1, numbered.indexOf('table') + 1].join(',');
  for (;;) {
    const answer = await prompter.ask('Numbers separated by commas', defaults);
    const picked = answer.split(',').map((n) => numbered[Number(n.trim()) - 1]);
    if (picked.length && picked.every(Boolean)) return [...new Set(picked)];
    console.log('  Enter numbers from the list, for example 1,2.');
  }
}

// ---- building the description of the page -----------------------------------------------------------------------------

async function pickModel(root: string, name: string, pageDirectory: string, warnings: string[], prompter: Prompter | null, label: string): Promise<ModelSpec | null> {
  const files = findModelFiles(root, name);
  if (!files.length) return null;
  let file = files[0];
  if (files.length > 1) {
    const shown = files.map((f) => toPosix(path.relative(root, f)));
    if (!prompter) throw new Error(`Several files match "${name}":\n  ${shown.join('\n  ')}\nGive the path of the one to use.`);
    console.log(`Several files match "${name}" (${label}):`);
    file = files[await prompter.choose('Which one?', shown)];
  }
  return parseModel(root, file, pageDirectory, warnings);
}

async function buildTable(flags: Flags, root: string, name: string, pageDirectory: string, notes: string[], prompter: Prompter | null): Promise<TableBlock> {
  const block = defaultBlock('table', name) as TableBlock;
  const requested = text(flags, 'table-model');

  if (requested && requested !== 'generic') {
    const model = await pickModel(root, requested, pageDirectory, notes, prompter, 'table');
    if (!model) throw new Error(`Model "${requested}" not found in src/, projects/, apps/ or libs/ (expected: ${kebab(requested)}.model.ts).`);
    block.model = model;
  } else if (!requested) {
    // No model asked for: reuse one that matches the page name.
    for (const candidate of new Set([kebab(name), singular(name)])) {
      const model = await pickModel(root, candidate, pageDirectory, notes, prompter, 'table');
      if (model) {
        console.log(`Reusing the existing model ${model.className} (${model.importPath}). Use --table-model generic to get a generic one.`);
        block.model = model;
        break;
      }
    }
  }

  const childName = text(flags, 'child-model');
  let wantsChild = flags.child === true || Boolean(childName);
  if (!wantsChild && flags.child !== false && prompter && !flags.blocks) wantsChild = await prompter.askYesNo('Open a second table under each row of the first one?', 'n');
  if (wantsChild) {
    let child: ModelSpec | null = null;
    if (childName && childName !== 'generic') {
      child = await pickModel(root, childName, pageDirectory, notes, prompter, 'child table');
      if (!child) throw new Error(`Model "${childName}" not found.`);
    }
    block.child = { title: `${block.title} details`, model: child ?? genericChildModel() };
  }
  return block;
}

interface Plan {
  config: PageConfig;
  directory: string;
  notes: string[];
}

async function buildPlan(flags: Flags, root: string, prompter: Prompter | null): Promise<Plan> {
  const notes: string[] = [];
  const configFile = text(flags, 'config');
  let name = text(flags, 'name');
  let config: PageConfig | null = null;

  if (configFile) {
    config = readJson(path.resolve(process.cwd(), configFile)) as PageConfig;
    name = name ?? config.name;
  }
  name = name ?? (prompter ? await prompter.askRequired('Page name in kebab-case (for example stock-items)') : undefined);
  if (!name) throw new Error('The page needs a name: use --name.');
  name = kebab(name);

  const defaultDirectory = defaultPagesDirectory(root);
  const directory = toPosix(path.normalize(text(flags, 'dir') ?? (prompter && !configFile && !flags.blocks ? await prompter.ask('Destination folder', defaultDirectory) : defaultDirectory))).replace(/\/$/, '');
  const pageDirectory = path.resolve(root, directory, name);

  const detected = usesNgxTranslate(root);
  let i18n = flags.i18n === true ? true : flags.i18n === false ? false : detected;
  if (config) {
    config.name = name;
  } else {
    const types = (text(flags, 'blocks')?.split(',').map((t) => t.trim()).filter(Boolean) as BlockType[] | undefined) ?? (prompter ? await askBlocks(prompter) : undefined);
    if (!types?.length) throw new Error('Choose the components of the page with --blocks or answer the questions.');
    const known = BLOCK_CATALOG.map((b) => b.type);
    const unknown = types.filter((t) => !known.includes(t));
    if (unknown.length) throw new Error(`Unknown component: ${unknown.join(', ')}. Available: ${known.join(', ')}.`);

    const blocks: Block[] = [];
    for (const type of types) {
      blocks.push(type === 'table' ? await buildTable(flags, root, name, pageDirectory, notes, prompter) : defaultBlock(type, name));
    }
    if (detected && flags.i18n === undefined && prompter && !flags.blocks) {
      i18n = await prompter.askYesNo('ngx-translate is installed: generate translation keys and add them to the English file?', 'y');
    }
    config = { name, i18n, blocks };
  }

  config.libPackage = text(flags, 'lib') ?? config.libPackage ?? detectLibrary(root);
  config.i18n = flags.i18n === true ? true : flags.i18n === false ? false : config.i18n ?? i18n;
  config.i18nRoot = text(flags, 'i18n-root') ?? config.i18nRoot;
  config.selectorPrefix = text(flags, 'prefix') ?? config.selectorPrefix ?? prefixOf(root, directory);
  return { config, directory, notes };
}

/** The prefix of the Angular project that contains the folder, from angular.json. */
function prefixOf(root: string, directory: string): string {
  const file = path.join(root, 'angular.json');
  if (!fs.existsSync(file)) return 'app';
  const projects = readJson(file).projects ?? {};
  const match = Object.values<any>(projects).find((project) => project.sourceRoot && `${directory}/`.startsWith(`${toPosix(project.sourceRoot)}/`));
  return match?.prefix ?? 'app';
}

// ---- writing --------------------------------------------------------------------------------------------------------------

function run(plan: Plan, root: string, flags: Flags): void {
  const dryRun = flags['dry-run'] === true;
  const { config, directory } = plan;
  const result = generatePage(config);
  const pageDirectory = path.resolve(root, directory, config.name);
  if (fs.existsSync(pageDirectory)) throw new Error(`${toPosix(path.relative(root, pageDirectory))} already exists: nothing was generated.`);

  const shown = (file: string) => toPosix(path.relative(root, file));
  const label = dryRun ? '(dry run) ' : '';
  for (const file of result.files) {
    const target = path.join(pageDirectory, file.path);
    if (!dryRun) {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, file.content, 'utf8');
    }
    console.log(`${dryRun ? '📝' : '✅'} ${label}${shown(target)}`);
    if (dryRun && flags.print === true) console.log(`\n${file.content}\n`);
  }

  if (config.i18n) {
    const translationFile = findTranslationFile(root, text(flags, 'i18n-dir'));
    const outcome = planTranslations(translationFile, result.translations, result.standardTranslations);
    if (outcome.note) console.log(`⚠️  ${outcome.note}`);
    else if (!outcome.added.length) console.log(`⏭️  ${shown(translationFile!)}: nothing to add.`);
    else {
      if (!dryRun) outcome.write?.();
      console.log(`${dryRun ? '📝' : '✅'} ${label}${shown(translationFile!)}: ${outcome.added.length} keys`);
    }
  }

  [...plan.notes, ...result.warnings].forEach((note) => console.log(`⚠️  ${note}`));

  // The route file sits in the `app` folder: import the page relative to it.
  const posixPage = toPosix(path.join(pageDirectory, config.name));
  const appFolder = posixPage.lastIndexOf('/app/');
  const importPath = appFolder >= 0 ? posixPage.slice(appFolder + '/app/'.length) : toPosix(path.relative(path.join(root, 'src/app'), path.join(pageDirectory, config.name)));
  console.log(`
Done${dryRun ? ' (dry run)' : ''}. To show the page:
  - in a template: <${result.selector}></${result.selector}>  (add ${result.className} to the imports of the component)
  - or as a route: { path: '${config.name}', title: '${title(config.name)}', loadComponent: () => import('./${importPath}').then((m) => m.${result.className}) }`);
}

async function main(): Promise<void> {
  const { flags, positional } = parseArguments(process.argv.slice(2));
  const command = positional[0] ?? 'add-page';
  if (flags.help === true || command === 'help') return console.log(USAGE);
  if (command !== 'add-page') throw new Error(`Unknown command "${command}". Try: npx easy-mat-ui add-page --help`);

  const root = findProjectRoot(process.cwd());
  const answered = Boolean(flags.name || flags.config) && Boolean(flags.blocks || flags.config);
  const prompter = answered ? null : createPrompter();
  try {
    run(await buildPlan(flags, root, prompter), root, flags);
  } finally {
    prompter?.close();
  }
}

main().catch((error: Error) => {
  console.error(`\x1b[31mError: ${error.message}\x1b[0m`);
  process.exit(1);
});
