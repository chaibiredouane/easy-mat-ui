import * as fs from 'fs';
import * as path from 'path';
import type * as TS from 'typescript';
import { kebab, pascal } from '../naming';
import { FieldType, ModelField, ModelSpec } from '../types';

/*
 * What the command learns about the project it runs in: where it is, which package gives the components, whether
 * ngx-translate is used, where the translations and the models are. It never installs anything.
 */

const SKIPPED = new Set(['node_modules', 'dist', 'tmp', '.git', '.angular', '.nx', 'out-tsc', 'coverage']);
export const toPosix = (file: string): string => file.split(path.sep).join('/');

export function readJson(file: string): any {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/** The folder with the `package.json`, looking upward from where the command was started. */
export function findProjectRoot(start: string): string {
  let current = path.resolve(start);
  for (;;) {
    if (fs.existsSync(path.join(current, 'package.json'))) return current;
    const parent = path.dirname(current);
    if (parent === current) throw new Error('No package.json found: run this command inside an Angular project.');
    current = parent;
  }
}

function dependencies(root: string): Record<string, string> {
  const pkg = readJson(path.join(root, 'package.json'));
  return { ...pkg.devDependencies, ...pkg.dependencies };
}

/** The package the components are imported from: the one that is installed, `easy-mat-ui` otherwise. */
export function detectLibrary(root: string): string {
  const deps = dependencies(root);
  return ['easy-mat-ui', '@lih/easy-mat-ui', 'easy-mat-ui'].find((name) => name in deps) ?? 'easy-mat-ui';
}

export const usesNgxTranslate = (root: string): boolean => '@ngx-translate/core' in dependencies(root);

/** `src/app/pages` when the project has it, otherwise `src/app`. */
export function defaultPagesDirectory(root: string): string {
  if (fs.existsSync(path.join(root, 'src/app/pages'))) return 'src/app/pages';
  if (fs.existsSync(path.join(root, 'src/app'))) return 'src/app/pages';
  return 'src/app';
}

/** The English translation file: in the folder given, or the usual places. */
export function findTranslationFile(root: string, directory?: string): string | null {
  const candidates = directory
    ? [path.resolve(root, directory, 'en.json')]
    : ['public/assets/i18n', 'src/assets/i18n', 'public/i18n', 'src/assets/locale'].map((dir) => path.join(root, dir, 'en.json'));
  return candidates.find((file) => fs.existsSync(file)) ?? null;
}

function walk(directory: string, visit: (file: string) => void): void {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (SKIPPED.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full, visit);
    else visit(full);
  }
}

/** Files named `<name>.model.ts` (or `<name>.ts` when a path or a name is given exactly) in the sources of the project. */
export function findModelFiles(root: string, name: string): string[] {
  const direct = [path.resolve(process.cwd(), name), path.resolve(root, name)].find((file) => file.endsWith('.ts') && fs.existsSync(file));
  if (direct) return [direct];
  const wanted = kebab(name.replace(/\.ts$/, '').replace(/\.model$/i, ''));
  const found: string[] = [];
  for (const folder of ['src', 'projects', 'apps', 'libs']) {
    const start = path.join(root, folder);
    if (!fs.existsSync(start)) continue;
    walk(start, (file) => {
      if (file.endsWith('.model.ts') && kebab(path.basename(file, '.model.ts')) === wanted) found.push(file);
    });
  }
  return found;
}

function typescriptOf(root: string): typeof TS {
  try {
    return require(require.resolve('typescript', { paths: [root] }));
  } catch {
    throw new Error('TypeScript was not found in the project: it is needed to read an existing model.');
  }
}

const NULLABLE = '(\\|null|\\|undefined)*';
const STRING_LITERAL = `('[^']*'|"[^"]*")`;

/** The kind of a property, or null when it is not text, a number, a boolean or a date (a list, an object, an enum...). */
function fieldType(ts: typeof TS, node: TS.PropertyDeclaration | TS.ParameterDeclaration, source: TS.SourceFile): FieldType | null {
  const text = node.type?.getText(source).replace(/\s+/g, '') ?? '';
  if (new RegExp(`^string${NULLABLE}$`).test(text) || new RegExp(`^${STRING_LITERAL}(\\|${STRING_LITERAL})*${NULLABLE}$`).test(text)) return 'string';
  if (new RegExp(`^number${NULLABLE}$`).test(text)) return 'number';
  if (new RegExp(`^boolean${NULLABLE}$`).test(text)) return 'boolean';
  if (new RegExp(`^Date${NULLABLE}$`).test(text)) return 'date';
  if (!text) {
    // No annotation: the initial value tells.
    const initializer = 'initializer' in node ? node.initializer : undefined;
    switch (initializer?.kind) {
      case ts.SyntaxKind.StringLiteral:
      case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
        return 'string';
      case ts.SyntaxKind.NumericLiteral:
        return 'number';
      case ts.SyntaxKind.TrueKeyword:
      case ts.SyntaxKind.FalseKeyword:
        return 'boolean';
    }
  }
  return null;
}

/** Reads the exported class of a model file: its public properties become the columns of the table. */
export function parseModel(root: string, file: string, importerDirectory: string, warnings: string[]): ModelSpec {
  const ts = typescriptOf(root);
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  const classes = source.statements.filter(
    (statement): statement is TS.ClassDeclaration =>
      ts.isClassDeclaration(statement) && !!statement.name && (ts.getCombinedModifierFlags(statement) & ts.ModifierFlags.Export) !== 0
  );
  const fileBase = kebab(path.basename(file, '.ts').replace(/\.model$/i, ''));
  if (!classes.length) {
    const hasInterface = source.statements.some((statement) => ts.isInterfaceDeclaration(statement));
    throw new Error(`${toPosix(path.relative(root, file))}: ${hasInterface ? 'only classes are supported (not interfaces)' : 'no exported class found'}.`);
  }
  const node = classes.find((candidate) => candidate.name!.text === pascal(fileBase)) ?? classes[0];

  const hidden = ts.ModifierFlags.Static | ts.ModifierFlags.Private | ts.ModifierFlags.Protected;
  const fields: ModelField[] = [];
  const ignored: string[] = [];
  const add = (member: TS.PropertyDeclaration | TS.ParameterDeclaration) => {
    const name = member.name && (ts.isIdentifier(member.name) || ts.isStringLiteral(member.name)) ? member.name.text : '';
    if (!name || ts.getCombinedModifierFlags(member) & hidden || fields.some((f) => f.name === name) || ignored.includes(name)) return;
    const type = fieldType(ts, member, source);
    if (type) {
      fields.push({ name, type });
    } else {
      ignored.push(name);
      const written = member.type?.getText(source) ?? 'unknown';
      warnings.push(`Field "${name}" (${written}) is left out: only text, number, boolean and date fields become columns.`);
    }
  };
  for (const member of node.members) {
    if (ts.isPropertyDeclaration(member)) add(member);
    if (ts.isConstructorDeclaration(member)) {
      member.parameters.filter((parameter) => ts.getCombinedModifierFlags(parameter) & ts.ModifierFlags.Public).forEach(add);
    }
  }
  if (!fields.length) throw new Error(`${toPosix(path.relative(root, file))}: no property found in class ${node.name!.text}.`);
  if (node.heritageClauses?.length) warnings.push(`${node.name!.text} extends another class: inherited fields are not read.`);

  const relative = toPosix(path.relative(importerDirectory, file)).replace(/\.ts$/, '');
  return {
    className: node.name!.text,
    fileBase,
    fields,
    generate: false,
    importPath: relative.startsWith('.') ? relative : `./${relative}`,
    ...(ignored.length ? { ignored } : {})
  };
}

/** Adds flat keys (`A.B.c`) to a nested JSON object without touching what is already there. Returns the keys added. */
function addKeys(target: Record<string, any>, flat: Record<string, string>): string[] {
  const added: string[] = [];
  for (const [key, text] of Object.entries(flat)) {
    const parts = key.split('.');
    let node = target;
    let blocked = false;
    for (const part of parts.slice(0, -1)) {
      if (node[part] === undefined) node[part] = {};
      if (typeof node[part] !== 'object' || node[part] === null) {
        blocked = true;
        break;
      }
      node = node[part];
    }
    const last = parts[parts.length - 1];
    if (!blocked && node[last] === undefined) {
      node[last] = text;
      added.push(key);
    }
  }
  return added;
}

export interface TranslationOutcome {
  /** Keys added to the file. */
  added: string[];
  /** What to tell the developer when the file could not be updated. */
  note?: string;
  /** The updated file, to write (absent in a dry run or when it could not be updated). */
  write?: () => void;
}

/** Plans the update of the English translation file: new keys only, same formatting. */
export function planTranslations(file: string | null, pageKeys: Record<string, string>, standardKeys: Record<string, string>): TranslationOutcome {
  const all = { ...pageKeys, ...standardKeys };
  if (!Object.keys(all).length) return { added: [] };
  const snippet = JSON.stringify(all, null, 2);
  if (!file) return { added: [], note: `No translation file found. Add these entries to your English file:\n${snippet}` };

  const raw = fs.readFileSync(file, 'utf8');
  const eol = raw.includes('\r\n') ? '\r\n' : '\n';
  const serialize = (json: unknown) => JSON.stringify(json, null, 2).replace(/\n/g, eol) + (/\n$/.test(raw) ? eol : '');
  const parsed = JSON.parse(raw);
  if (serialize(parsed) !== raw) {
    return { added: [], note: `${path.basename(file)} has an unusual format, so it was not rewritten. Add these entries by hand:\n${snippet}` };
  }
  const added = addKeys(parsed, all);
  return { added, write: () => fs.writeFileSync(file, serialize(parsed), 'utf8') };
}
