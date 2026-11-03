export type PopulationUnit = 'auto' | 'units' | 'thousands' | 'millions';

export const POPULATION_UNITS: { id: PopulationUnit; label: string; hint: string }[] = [
  { id: 'auto', label: 'Auto', hint: 'K, M or B depending on the value' },
  { id: 'units', label: 'Units', hint: 'Full number with thousands separators' },
  { id: 'thousands', label: 'Thousands', hint: 'Always in K' },
  { id: 'millions', label: 'Millions', hint: 'Always in M' }
];

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

/** Exact value with locale separators, used in tooltips. */
export function exactPopulation(value: number | null | undefined, locale = 'en'): string {
  return value == null ? 'No published value' : new Intl.NumberFormat(locale).format(value);
}
