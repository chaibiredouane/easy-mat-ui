export type LanguageCode = 'en' | 'ar' | 'fr' | 'de' | 'lb';

export interface Language {
  code: LanguageCode;
  /** Name of the language in that language: it is what the visitor looks for in the menu. */
  name: string;
  /** flag-icons suffix (`fi fi-gb`). */
  flag: string;
  /** Text direction of the whole page. */
  dir: 'ltr' | 'rtl';
  /** BCP 47 tag given to `Intl` to format numbers and to rank the country names. */
  locale: string;
}

export const LANGUAGES: readonly Language[] = [
  { code: 'en', name: 'English', flag: 'gb', dir: 'ltr', locale: 'en' },
  // The flag of Algeria: Algeria comes first in the demo data and Arabic is its main language.
  { code: 'ar', name: 'العربية', flag: 'dz', dir: 'rtl', locale: 'ar-DZ' },
  { code: 'fr', name: 'Français', flag: 'fr', dir: 'ltr', locale: 'fr' },
  { code: 'de', name: 'Deutsch', flag: 'de', dir: 'ltr', locale: 'de' },
  { code: 'lb', name: 'Lëtzebuergesch', flag: 'lu', dir: 'ltr', locale: 'de-LU' }
];

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

export function isLanguageCode(value: unknown): value is LanguageCode {
  return LANGUAGES.some((l) => l.code === value);
}
