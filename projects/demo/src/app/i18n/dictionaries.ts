import { AR } from './ar';
import { DE } from './de';
import { Dictionary, EN } from './en';
import { FR } from './fr';
import { LB } from './lb';
import { LanguageCode } from './languages';

/** All dictionaries are small, so they are bundled: switching language is instant and works offline. */
export const DICTIONARIES: Record<LanguageCode, Dictionary> = { en: EN, ar: AR, fr: FR, de: DE, lb: LB };
