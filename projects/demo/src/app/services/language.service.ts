import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DICTIONARIES } from '../i18n/dictionaries';
import { DEFAULT_LANGUAGE, isLanguageCode, Language, LANGUAGES, LanguageCode } from '../i18n/languages';

const STORAGE_KEY = 'easy-mat-ui-demo.lang';

/**
 * Language of the demo. It drives three things at once: the ngx-translate language (so every label of
 * easy-mat-ui follows), the direction of the page (Arabic is right-to-left) and the locale that formats
 * numbers. The choice is remembered, and `?lang=fr` in the address opens the demo in that language.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);

  readonly languages = LANGUAGES;
  private readonly code = signal<LanguageCode>(DEFAULT_LANGUAGE);

  readonly current = computed<Language>(() => LANGUAGES.find((l) => l.code === this.code()) ?? LANGUAGES[0]);
  readonly locale = computed(() => this.current().locale);
  readonly dir = computed(() => this.current().dir);

  private readonly regionNames = new Map<LanguageCode, Intl.DisplayNames | null>();

  /** Registers the dictionaries and picks the first language: address, then saved choice, then browser. */
  init(): void {
    for (const language of LANGUAGES) {
      this.translate.setTranslation(language.code, DICTIONARIES[language.code]);
    }
    this.translate.addLangs(LANGUAGES.map((l) => l.code));
    this.translate.setDefaultLang(DEFAULT_LANGUAGE);
    this.set(this.initialLanguage(), false);
  }

  set(code: LanguageCode, remember = true): void {
    this.translate.use(code);
    this.code.set(code);
    const root = this.document.documentElement;
    root.lang = code;
    root.dir = this.current().dir;
    if (remember) {
      try {
        localStorage.setItem(STORAGE_KEY, code);
      } catch {
        /* storage blocked (private window): the choice only lasts for this visit */
      }
    }
  }

  /** Name of a country in the current language, from its ISO code; `fallback` when the browser cannot tell. */
  countryName(isoCode: string, fallback: string): string {
    const code = this.code();
    if (!this.regionNames.has(code)) {
      try {
        this.regionNames.set(code, new Intl.DisplayNames([code], { type: 'region' }));
      } catch {
        this.regionNames.set(code, null);
      }
    }
    try {
      return this.regionNames.get(code)?.of(isoCode.toUpperCase()) ?? fallback;
    } catch {
      return fallback;
    }
  }

  private initialLanguage(): LanguageCode {
    const fromAddress = this.document.defaultView?.location.search
      ? new URLSearchParams(this.document.defaultView.location.search).get('lang')
      : null;
    if (isLanguageCode(fromAddress)) {
      return fromAddress;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isLanguageCode(saved)) {
        return saved;
      }
    } catch {
      /* storage blocked: fall through to the browser language */
    }
    const preferred = this.document.defaultView?.navigator.languages ?? [];
    for (const tag of preferred) {
      const base = tag.toLowerCase().split('-')[0];
      if (isLanguageCode(base)) {
        return base;
      }
      if (base === 'lu') {
        return 'lb'; // some browsers use the ISO 639-2 code of Luxembourgish
      }
    }
    return DEFAULT_LANGUAGE;
  }
}
