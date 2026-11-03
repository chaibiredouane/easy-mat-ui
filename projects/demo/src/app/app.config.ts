import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { EN } from './i18n/en';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideTranslateService({ defaultLanguage: 'en' }),
    // easy-mat-ui reads all its labels through ngx-translate.
    provideAppInitializer(() => {
      const translate = inject(TranslateService);
      translate.setTranslation('en', EN);
      translate.use('en');
    })
  ]
};
