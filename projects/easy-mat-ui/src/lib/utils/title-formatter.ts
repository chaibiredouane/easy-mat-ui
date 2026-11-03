import {formatDate} from '@angular/common';

const REQUIRED_MISSING = Symbol('title-required-missing');

export type TitlePipe = (value: any, arg?: string) => any;
export type TitleTranslate = (key: string) => string;

export class TitleFormatter {
  private static readonly LOCALE = 'en_LU';

  private static readonly pipes: Record<string, TitlePipe> = {
    date: v => formatDate(v, 'yyyy-MM-dd', TitleFormatter.LOCALE),
    datetime: v => formatDate(v, 'yyyy-MM-dd HH:mm', TitleFormatter.LOCALE),
    upper: v => String(v).toUpperCase(),
    lower: v => String(v).toLowerCase(),
    default: (v, arg) => isEmpty(v) ? arg : v
  };

  static register(name: string, fn: TitlePipe): void {
    TitleFormatter.pipes[name] = fn;
  }


  static format(template: string | null | undefined, item: any, fallback: string | null = '', translate?: TitleTranslate): string {
    return TitleFormatter.tryRun(template, item, translate) ?? TitleFormatter.tryRun(fallback, item, translate) ?? '';
  }

  private static tryRun(template: string | null | undefined, item: any, translate?: TitleTranslate): string | null {
    if (!template) return null;
    try {
      return TitleFormatter.run(template, item, translate) || null;
    } catch (e) {
      if (e === REQUIRED_MISSING) return null;
      throw e;
    }
  }

  private static run(template: string, item: any, translate?: TitleTranslate): string {
    return template
      .replace(/\[([^\[\]]*)]/g, (_, part) => TitleFormatter.render(part, item, true, translate))
      .replace(/^(.*)$/s, (all) => TitleFormatter.render(all, item, false, translate))
      .trim();
  }

  private static render(part: string, item: any, optional: boolean, translate?: TitleTranslate): string {
    let missing = false;
    const out = part.replace(/\{([^{}]+)}/g, (_, expr: string) => {
      const [rawPath, ...pipes] = expr.split('|').map(s => s.trim());
      const required = rawPath.startsWith('!');
      const path = required ? rawPath.slice(1) : rawPath;
      let value = path.startsWith('@')
        ? (translate ? translate(path.slice(1)) : path.slice(1))
        : path.split('.').reduce((o, k) => o?.[k], item);
      for (const p of pipes) {
        const [name, ...args] = p.split(':');
        const fn = TitleFormatter.pipes[name.trim()];
        if (fn && !(isEmpty(value) && name.trim() !== 'default')) {
          value = fn(value, args.join(':'));
        }
      }
      if (isEmpty(value)) {
        if (required) throw REQUIRED_MISSING;
        missing = true;
        return '';
      }
      return String(value);
    });
    return optional && missing ? '' : out;
  }
}

function isEmpty(v: any): boolean {
  return v === null || v === undefined || v === '';
}
