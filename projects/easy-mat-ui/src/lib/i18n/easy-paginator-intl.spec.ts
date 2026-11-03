import { TestBed } from '@angular/core/testing';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideEasyPaginatorIntl } from './easy-paginator-intl';

describe('EasyPaginatorIntl', () => {
  let intl: MatPaginatorIntl;
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TranslateModule.forRoot()], providers: [provideEasyPaginatorIntl()] });
    translate = TestBed.inject(TranslateService);
    translate.setTranslation('fr', {
      PAGINATOR: { ITEMS_PER_PAGE: 'Éléments par page :', NEXT_PAGE: 'Page suivante', RANGE: '{{start}} – {{end}} sur {{length}}' }
    });
    intl = TestBed.inject(MatPaginatorIntl);
  });

  it('uses English labels while no translation exists', () => {
    expect(intl.itemsPerPageLabel).toBe('Items per page:');
    expect(intl.getRangeLabel(0, 10, 194)).toBe('1 – 10 of 194');
    expect(intl.getRangeLabel(0, 10, 0)).toBe('0 of 0');
  });

  it('follows the language of ngx-translate, live', () => {
    let changes = 0;
    intl.changes.subscribe(() => changes++);
    translate.use('fr').subscribe();
    expect(intl.itemsPerPageLabel).toBe('Éléments par page :');
    expect(intl.nextPageLabel).toBe('Page suivante');
    expect(intl.getRangeLabel(1, 10, 194)).toBe('11 – 20 sur 194');
    expect(intl.previousPageLabel).toBe('Previous page'); // key missing: English fallback
    expect(changes).toBeGreaterThan(0);
  });
});
