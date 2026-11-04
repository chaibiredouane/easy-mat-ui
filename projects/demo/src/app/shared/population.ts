export type PopulationUnit = 'auto' | 'units' | 'thousands' | 'millions';

/** Ids only: the label and the hint come from the dictionaries (`units.<id>` and `units.<id>_hint`). */
export const POPULATION_UNITS: readonly PopulationUnit[] = ['auto', 'units', 'thousands', 'millions'];

// #region population-format
/**
 * Formats a population for display. The raw value is never modified.
 *
 * Rounding rule (half away from zero, as done by `Intl.NumberFormat`):
 *  - units:     whole number
 *  - thousands: whole thousands            (1,234,567 -> "1,235 K")
 *  - millions:  up to 2 decimals           (1,234,567 -> "1.23 M")
 *  - billions:  up to 2 decimals           (only reachable with `auto`)
 * In `auto` mode the unit is chosen from the magnitude: < 1,000 units, < 1 M thousands, < 1 B millions.
 */
export function formatPopulation(value: number | null | undefined, unit: PopulationUnit = 'auto', locale = 'en'): string {
  if (value == null || Number.isNaN(value)) {
    return '—';
  }
  const resolved: Exclude<PopulationUnit, 'auto'> | 'billions' = unit === 'auto' ? pickUnit(value) : unit;
  const number = (n: number, maximumFractionDigits: number) => new Intl.NumberFormat(locale, { maximumFractionDigits }).format(n);
  switch (resolved) {
    case 'thousands':
      return `${number(value / 1_000, 0)} K`;
    case 'millions':
      return `${number(value / 1_000_000, 2)} M`;
    case 'billions':
      return `${number(value / 1_000_000_000, 2)} B`;
    default:
      return number(value, 0);
  }
}

function pickUnit(value: number): 'units' | 'thousands' | 'millions' | 'billions' {
  const abs = Math.abs(value);
  // Thresholds sit just below the next unit so that rounding never shows "1,000 K" or "1,000 M".
  if (abs >= 999_995_000) return 'billions';
  if (abs >= 999_500) return 'millions';
  if (abs >= 1_000) return 'thousands';
  return 'units';
}
// #endregion population-format

/**
 * Keeps "1.2 M" in reading order inside right-to-left text. Without it the bidirectional algorithm shows
 * "M 1.2" in an Arabic table. It wraps the text in a left-to-right isolate (U+2066 ... U+2069).
 */
export function keepLtr(text: string): string {
  return `⁦${text}⁩`;
}

/** Languages written right to left (the locale tag starts with their code). */
export function isRtlLocale(locale: string): boolean {
  return /^(ar|he|fa|ur)(-|$)/.test(locale);
}

/** Exact value with locale separators, used in tooltips. */
export function exactPopulation(value: number | null | undefined, locale = 'en'): string {
  return value == null ? '—' : new Intl.NumberFormat(locale).format(value);
}
