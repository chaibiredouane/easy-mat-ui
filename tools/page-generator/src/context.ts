import { attributeEscape, constant, quote } from './naming';

/** The `import { ... } from '...'` lines of a generated file, grouped by module. */
export class ImportBook {
  private readonly modules = new Map<string, Set<string>>();

  add(from: string, ...names: string[]): void {
    const set = this.modules.get(from) ?? new Set<string>();
    names.forEach((name) => set.add(name));
    this.modules.set(from, set);
  }

  /** Angular first, then other packages, then the files of the project. Names are sorted. */
  render(): string {
    const rank = (from: string) => (from.startsWith('@angular/') ? 0 : from.startsWith('.') ? 2 : 1);
    return [...this.modules.keys()]
      .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
      .map((from) => {
        const names = [...this.modules.get(from)!].sort((a, b) => a.localeCompare(b));
        const line = `import { ${names.join(', ')} } from '${from}';`;
        // A long list goes one name per line, so the file stays easy to read and to merge.
        return line.length <= 120 ? line : `import {\n${names.map((name) => `  ${name}`).join(',\n')}\n} from '${from}';`;
      })
      .join('\n');
  }
}

/**
 * What the blocks of a page build together: imports, members of the component, styles and translations.
 * Every text goes through `tpl`, `ts` or `attr`, so that the same code serves the mode with translations
 * (keys in the translation file) and the mode without (the texts themselves).
 */
export class Ctx {
  readonly translations: Record<string, string> = {};
  readonly imports = new ImportBook();
  /** Names listed in `imports: [...]` of the component. */
  readonly componentImports = new Set<string>();
  readonly styles = new Set<string>();
  readonly warnings: string[] = [];
  /** Members that come first in the class: they are used by the ones that follow. */
  readonly infrastructure: string[] = [];
  readonly members: string[] = [];

  /** The template uses the `translate` pipe. */
  usesPipe = false;
  /** The code asks the `TranslateService` for texts: computed values that read the language. */
  usesInstant = false;
  /** The code needs the `TranslateService` (to read texts or to change the language). */
  needsTranslateService = false;

  private readonly counters = new Map<string, number>();

  constructor(
    readonly pageConstant: string,
    readonly i18n: boolean,
    readonly root: string,
    readonly lib: string
  ) {}

  /** `nav`, then `nav2`, `nav3`... when a page has several blocks of a kind. */
  varName(base: string): string {
    const n = (this.counters.get(base) ?? 0) + 1;
    this.counters.set(base, n);
    return n === 1 ? base : `${base}${n}`;
  }

  useLib(...names: string[]): void {
    this.imports.add(this.lib, ...names);
  }

  useComponent(name: string): void {
    this.componentImports.add(name);
    this.useLib(name);
  }

  key(suffix: string): string {
    return `${this.root}.${this.pageConstant}.${suffix}`;
  }

  /** A text in a template expression (an object literal in a binding, or `{{ }}`). */
  tpl(suffix: string, english: string): string {
    if (!this.i18n) return quote(english);
    this.usesPipe = true;
    this.translations[this.key(suffix)] = english;
    return `('${this.key(suffix)}' | translate)`;
  }

  /** A text in TypeScript code that runs again when the language changes (inside a `computed`). */
  ts(suffix: string, english: string): string {
    if (!this.i18n) return quote(english);
    this.usesInstant = true;
    this.needsTranslateService = true;
    this.translations[this.key(suffix)] = english;
    return `this.translate.instant('${this.key(suffix)}')`;
  }

  /** An HTML attribute: static text without translations, a binding with them. */
  attr(name: string, suffix: string, english: string): string {
    if (!this.i18n) return `${name}="${attributeEscape(english)}"`;
    this.usesPipe = true;
    this.translations[this.key(suffix)] = english;
    return `[${name}]="'${this.key(suffix)}' | translate"`;
  }

  /** A key-less text placed by the author (not translated, for example the name of a language). */
  literal(english: string): string {
    return quote(english);
  }
}

export const keyOf = (name: string): string => constant(name);
