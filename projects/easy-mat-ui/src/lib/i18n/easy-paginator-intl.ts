import { inject, Injectable, Provider } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

/**
 * Angular Material paginator labels read through ngx-translate, so the table paginator follows the language of
 * the application. Keys (all optional, English is used when a key is missing):
 *
 * - `PAGINATOR.ITEMS_PER_PAGE`, `PAGINATOR.NEXT_PAGE`, `PAGINATOR.PREVIOUS_PAGE`, `PAGINATOR.FIRST_PAGE`,
 *   `PAGINATOR.LAST_PAGE`
 * - `PAGINATOR.RANGE`, with the parameters `{{start}}`, `{{end}}` and `{{length}}`
 *
 * Register it once with {@link provideEasyPaginatorIntl}.
 */
@Injectable()
export class EasyPaginatorIntl extends MatPaginatorIntl {
  private readonly translate = inject(TranslateService);

  constructor() {
    super();
    this.translate.onLangChange.subscribe(() => this.refresh());
    this.translate.onTranslationChange.subscribe(() => this.refresh());
    this.refresh();
  }

  private text(key: string, fallback: string, params?: object): string {
    const value = this.translate.instant(key, params);
    return value && value !== key ? value : fallback;
  }

  private refresh(): void {
    this.itemsPerPageLabel = this.text('PAGINATOR.ITEMS_PER_PAGE', 'Items per page:');
    this.nextPageLabel = this.text('PAGINATOR.NEXT_PAGE', 'Next page');
    this.previousPageLabel = this.text('PAGINATOR.PREVIOUS_PAGE', 'Previous page');
    this.firstPageLabel = this.text('PAGINATOR.FIRST_PAGE', 'First page');
    this.lastPageLabel = this.text('PAGINATOR.LAST_PAGE', 'Last page');
    this.getRangeLabel = (page: number, pageSize: number, length: number): string => {
      if (length === 0 || pageSize === 0) {
        return this.text('PAGINATOR.RANGE', `0 of ${length}`, { start: 0, end: 0, length });
      }
      const start = page * pageSize;
      const end = Math.min(start + pageSize, length);
      return this.text('PAGINATOR.RANGE', `${start + 1} – ${end} of ${length}`, { start: start + 1, end, length });
    };
    this.changes.next();
  }
}

/** Makes the paginator of every easy-mat-ui table (and any Material paginator) follow the ngx-translate language. */
export function provideEasyPaginatorIntl(): Provider {
  return { provide: MatPaginatorIntl, useClass: EasyPaginatorIntl };
}
