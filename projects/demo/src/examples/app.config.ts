import { ApplicationConfig } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';
import { provideEasyPaginatorIntl } from 'easy-mat-ui-ng20';

export const appConfig: ApplicationConfig = {
  providers: [
    // The labels of the table and of its dialog are read through ngx-translate.
    // Without a dictionary they show their keys or texts as they are, so this line is all you need to start.
    provideTranslateService({ defaultLanguage: 'en' }),
    // Optional: the paginator follows the language of ngx-translate (keys PAGINATOR.*).
    provideEasyPaginatorIntl()
  ]
};
