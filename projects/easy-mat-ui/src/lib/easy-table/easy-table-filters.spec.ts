import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatColumnTyped } from '../model/mat-column-typed.model';
import { EasyTableComponent } from './easy-table.component';

describe('EasyTableComponent filters', () => {
  let fixture: ComponentFixture<EasyTableComponent<any>>;
  let table: EasyTableComponent<any>;

  const rows = () => table.dataSource.filteredData.map((r: any) => r.name);

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [EasyTableComponent, TranslateModule.forRoot()] }).compileComponents();
    fixture = TestBed.createComponent(EasyTableComponent);
    table = fixture.componentInstance;
    table.config = {
      data: [{ id: 1, name: 'Alice', city: 'Paris' }, { id: 2, name: 'Bob', city: 'Berlin' }, { id: 3, name: 'Bianca', city: 'Rome' }],
      sortedBy: '',
      withFilterInHeader: true,
      displayedColumns: [
        new MatColumnTyped({ name: 'name', enableFilter: true, filterType: 'text' }),
        new MatColumnTyped({ name: 'city', enableFilter: true })
      ]
    };
    fixture.detectChanges();
  });

  it('defaults to the multi-select filter, as before', () => {
    expect(new MatColumnTyped({ name: 'x' }).filterType).toBe('select');
  });

  it('reports whether the header needs a filter row', () => {
    expect(table.hasColumnFilters).toBeTrue();
  });

  it('filters rows from a text column filter and remembers what was typed', () => {
    table.onColumnTextFilter('Bi', table.displayedColumns[0]);
    expect(rows()).toEqual(['Bianca']);
    expect(table.columnFilterText['name']).toBe('Bi');
  });

  it('clears the text filters with the toolbar button', () => {
    table.onColumnTextFilter('bo', table.displayedColumns[0]);
    expect(rows()).toEqual(['Bob']);
    table.clearTableFilter();
    expect(table.columnFilterText).toEqual({});
    expect(rows().length).toBe(3);
  });

  it('never writes the normalized search text back into the search box (characters were lost while typing)', () => {
    table.applyFilter({ target: { value: ' Pal ' } } as unknown as Event);
    expect(table.searchText).toBe('pal');
    expect(table.searchTableField).toBe(''); // the value bound to the input is left alone
  });
});

describe('EasyTableComponent row selection', () => {
  it('identifies a row by rowKey, so rows sharing an id are not selected together', async () => {
    await TestBed.configureTestingModule({ imports: [EasyTableComponent, TranslateModule.forRoot()] }).compileComponents();
    const fixture = TestBed.createComponent(EasyTableComponent);
    const table = fixture.componentInstance;
    const a = { id: 1, code: 'A', name: 'first' };
    const b = { id: 1, code: 'B', name: 'second' };
    table.config = { data: [a, b], rowKey: 'code', displayedColumns: [new MatColumnTyped({ name: 'name' })] };
    fixture.detectChanges();

    table.manageSelectedRow(a);
    expect(table.getSelectedRow(a)).toBeTrue();
    expect(table.getSelectedRow(b)).toBeFalse();
  });

  it('keeps the selection when the data is rebuilt (same key, new objects)', async () => {
    await TestBed.configureTestingModule({ imports: [EasyTableComponent, TranslateModule.forRoot()] }).compileComponents();
    const table = TestBed.createComponent(EasyTableComponent).componentInstance;
    table.config = { data: [], displayedColumns: [new MatColumnTyped({ name: 'name' })] };
    table.manageSelectedRow({ id: 7, name: 'x' });
    expect(table.getSelectedRow({ id: 7, name: 'x (reloaded)' })).toBeTrue();
    expect(table.getSelectedRow({ id: 8, name: 'y' })).toBeFalse();
  });
});
