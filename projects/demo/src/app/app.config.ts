import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';
import { provideEasyPaginatorIntl } from 'easy-mat-ui';
import { DEFAULT_LANGUAGE } from './i18n/languages';
import { LanguageService } from './services/language.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideTranslateService({ defaultLanguage: DEFAULT_LANGUAGE }),
    // The paginator of every table follows the ngx-translate language (PAGINATOR.* keys).
    provideEasyPaginatorIntl(),
    // easy-mat-ui reads all its labels through ngx-translate: load the five dictionaries and pick the language.
    provideAppInitializer(() => inject(LanguageService).init())
  ]
};
