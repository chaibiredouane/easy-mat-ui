/** Case conversions and quoting used by the generator. No dependency, so it runs in Node and in the browser. */

const words = (text: string): string[] =>
  text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/[\s_.\-/]+/)
    .filter(Boolean);

const capitalize = (word: string): string => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

export const kebab = (text: string): string => words(text).map((w) => w.toLowerCase()).join('-');
export const pascal = (text: string): string => words(text).map(capitalize).join('');
export const camel = (text: string): string => {
  const value = pascal(text);
  return value.charAt(0).toLowerCase() + value.slice(1);
};
export const constant = (text: string): string => words(text).map((w) => w.toUpperCase()).join('_');
export const title = (text: string): string => words(text).map(capitalize).join(' ');

/** `isActive` gives "Active", `lastUpdatedDate` gives "Last updated date". */
export function label(field: string): string {
  const text = words(field.replace(/^is(?=[A-Z])/, '')).join(' ').toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** A TypeScript string literal in single quotes. */
export function quote(text: string): string {
  return `'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`;
}

/** Text placed inside a double-quoted HTML attribute. */
export function attributeEscape(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/** A valid property name for a field or an id: letters, digits, `_` and `$`, not starting with a digit. */
export function isIdentifier(text: string): boolean {
  return /^[A-Za-z_$][\w$]*$/.test(text);
}

/** `stock-items` gives `stock-item`: used to look for a model that matches a page name. */
export function singular(text: string): string {
  const base = kebab(text).replace(/-management$/, '');
  if (/ies$/.test(base)) return base.replace(/ies$/, 'y');
  if (/(ss|us)$/.test(base)) return base;
  return base.replace(/s$/, '');
}
