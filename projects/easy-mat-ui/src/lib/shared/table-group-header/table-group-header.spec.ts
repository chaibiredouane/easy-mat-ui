import {Type} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';
import {EasyTableComponent} from '../../easy-table/easy-table.component';
import {EasyTableBasicComponent} from '../../easy-table-basic/easy-table-basic.component';
import {EasyTableConfig} from '../../model/easy-table-config.model';
import {EasyTableGroupBy, EasyTableGroupSelectionChange} from '../../model/easy-table-grouping.model';
import {EasyTableSelectionChange} from '../../model/easy-table-selection.model';
import {MatColumnTyped} from '../../model/mat-column-typed.model';
import {ColumnType} from '../../utils/enums';

type Host = EasyTableComponent<any> | EasyTableBasicComponent<any>;

function buildRows(): any[] {
  return [
    {id: 1, form: 'Demographics', name: 'age', isActive: true, isLocked: false},
    {id: 2, form: 'Demographics', name: 'sex', isActive: false, isLocked: false},
    {id: 3, form: 'Labs', name: 'glucose', isActive: true, isLocked: false},
    {id: 4, form: 'Labs', name: 'urea', isActive: true, isLocked: false},
    {id: 5, form: null, name: 'notes', isActive: false, isLocked: false}
  ];
}

function buildConfig(groupBy?: EasyTableGroupBy, readonlyRows = false): EasyTableConfig {
  return new EasyTableConfig({
    withToolbar: false,
    changePageSize: 50,
    data: buildRows(),
    groupBy,
    displayedColumns: [
      new MatColumnTyped({name: 'name', type: ColumnType.TEXT}),
      new MatColumnTyped({name: 'isActive', type: ColumnType.Checkbox, selection: {enabled: !readonlyRows}}),
      new MatColumnTyped({name: 'isLocked', type: ColumnType.Checkbox, selection: {enabled: true}}),
      new MatColumnTyped({name: 'form', type: ColumnType.TEXT})
    ]
  });
}

const componentTypes: Type<Host>[] = [EasyTableBasicComponent, EasyTableComponent];

componentTypes.forEach(componentType => {
  describe(`Row grouping in ${componentType.name}`, () => {
    let fixture: ComponentFixture<Host>;
    let rowEvents: EasyTableSelectionChange[];
    let groupEvents: EasyTableGroupSelectionChange[];
    let config: EasyTableConfig;

    function create(groupBy?: EasyTableGroupBy, readonlyRows = false): void {
      config = buildConfig(groupBy, readonlyRows);
      fixture = TestBed.createComponent(componentType);
      rowEvents = [];
      groupEvents = [];
      fixture.componentInstance.selectionChange.subscribe((event: EasyTableSelectionChange) => rowEvents.push(event));
      fixture.componentInstance.groupSelectionChange.subscribe((event: EasyTableGroupSelectionChange) => groupEvents.push(event));
      fixture.componentRef.setInput('config', config);
      fixture.detectChanges();
    }

    const headers = (): HTMLElement[] => Array.from(fixture.nativeElement.querySelectorAll('lib-table-group-header'));
    const dataRows = (): HTMLElement[] => Array.from(fixture.nativeElement.querySelectorAll('tr.group-child:not(.row-group-header)'));
    const toggleButton = (index: number): HTMLButtonElement => headers()[index].querySelector('.group-toggle') as HTMLButtonElement;
    const groupCheck = (index: number): HTMLButtonElement | null => headers()[index].querySelector('lib-table-check-mark button');
    const redraw = () => fixture.detectChanges();

    beforeEach(() => TestBed.configureTestingModule({imports: [componentType, TranslateModule.forRoot()]}));

    it('renders no group header without groupBy', () => {
      create();
      expect(headers().length).toBe(0);
      expect(fixture.nativeElement.querySelectorAll('tr.zebra-odd, tr.zebra-even').length).toBe(5);
    });

    it('groups rows by the configured field, with an empty group for null values', () => {
      create({field: 'form'});
      expect(headers().map(h => h.querySelector('.group-title')!.textContent!.trim())).toEqual(['Demographics', 'Labs', '—']);
      expect(headers().map(h => h.querySelector('.group-count')!.textContent!.trim())).toEqual(['2', '2', '1']);
      expect(dataRows().length).toBe(5);
    });

    it('hides the group column unless showGroupColumn is set', () => {
      const headerCount = () => fixture.nativeElement.querySelectorAll('th.mat-mdc-header-cell').length;
      create({field: 'form'});
      expect(headerCount()).toBe(3);
      create({field: 'form', showGroupColumn: true});
      expect(headerCount()).toBe(4);
      create();
      expect(headerCount()).toBe(4);
    });

    it('collapses and expands groups independently', () => {
      create({field: 'form'});
      toggleButton(0).click();
      redraw();
      expect(dataRows().length).toBe(3);
      toggleButton(1).click();
      redraw();
      expect(dataRows().length).toBe(1);
      toggleButton(0).click();
      redraw();
      expect(dataRows().length).toBe(3);
    });

    it('honours the initial collapsed state and non collapsible groups', () => {
      create({field: 'form', expanded: false});
      expect(dataRows().length).toBe(0);
      create({field: 'form', collapsible: false, expanded: false});
      expect(dataRows().length).toBe(5);
      expect(toggleButton(0).disabled).toBeTrue();
    });

    it('shows no group checkbox when no selection field is configured', () => {
      create({field: 'form'});
      expect(groupCheck(0)).toBeNull();
    });

    it('reflects checked, unchecked and mixed states', () => {
      create({field: 'form', selectionField: 'isActive'});
      expect(groupCheck(0)!.getAttribute('aria-checked')).toBe('mixed');
      expect(groupCheck(1)!.getAttribute('aria-checked')).toBe('true');
      expect(groupCheck(2)!.getAttribute('aria-checked')).toBe('false');
    });

    it('selects then deselects every row of a group with a single event, even when collapsed', () => {
      create({field: 'form', selectionField: 'isActive'});
      toggleButton(0).click();
      redraw();

      groupCheck(0)!.click();
      redraw();
      expect(groupEvents.length).toBe(1);
      expect(groupEvents[0].field).toBe('isActive');
      expect(groupEvents[0].groupValue).toBe('Demographics');
      expect(groupEvents[0].value).toBeTrue();
      expect(groupEvents[0].previousState).toBe('some');
      expect(groupEvents[0].rows.map(row => row.name)).toEqual(['sex']);
      expect(config.data[1].isActive).toBeTrue();
      expect(groupCheck(0)!.getAttribute('aria-checked')).toBe('true');
      expect(rowEvents.length).toBe(0);

      groupCheck(0)!.click();
      redraw();
      expect(groupEvents.length).toBe(2);
      expect(groupEvents[1].value).toBeFalse();
      expect(groupEvents[1].rows.map(row => row.name)).toEqual(['age', 'sex']);
      expect(config.data[0].isActive).toBeFalse();
      expect(groupCheck(0)!.getAttribute('aria-checked')).toBe('false');
    });

    it('expands and collapses every group with the global controls', () => {
      create({field: 'form', selectionField: 'isActive'});
      const controls = (): HTMLButtonElement[] => Array.from(fixture.nativeElement.querySelectorAll('.group-control'));
      expect(controls().length).toBe(2);
      expect(controls()[0].disabled).toBeTrue();
      expect(controls()[1].disabled).toBeFalse();

      controls()[1].click();
      redraw();
      expect(dataRows().length).toBe(0);
      expect(headers().length).toBe(3);
      expect(controls()[1].disabled).toBeTrue();
      expect(groupCheck(0)!.getAttribute('aria-checked')).toBe('mixed');

      toggleButton(1).click();
      redraw();
      expect(controls()[0].disabled).toBeFalse();
      expect(controls()[1].disabled).toBeFalse();

      controls()[0].click();
      redraw();
      expect(dataRows().length).toBe(5);
      expect(controls()[0].disabled).toBeTrue();
      expect(config.data[0].isActive).toBeTrue();
    });

    it('hides the global controls without groupBy, when not collapsible or when turned off', () => {
      const count = () => fixture.nativeElement.querySelectorAll('.group-control').length;
      create();
      expect(count()).toBe(0);
      create({field: 'form', collapsible: false});
      expect(count()).toBe(0);
      create({field: 'form', showToggleAll: false});
      expect(count()).toBe(0);
    });

    it('keeps the selection when a group is collapsed and expanded', () => {
      create({field: 'form', selectionField: 'isActive'});
      groupCheck(2)!.click();
      redraw();
      toggleButton(2).click();
      redraw();
      toggleButton(2).click();
      redraw();
      expect(config.data[4].isActive).toBeTrue();
      expect(groupCheck(2)!.getAttribute('aria-checked')).toBe('true');
    });

    it('leaves other checkbox columns untouched and updates the group state after a row click', () => {
      create({field: 'form', selectionField: 'isActive'});
      groupCheck(0)!.click();
      redraw();
      expect(config.data.every(row => row.isLocked === false)).toBeTrue();

      const rowCheck = fixture.nativeElement.querySelector('tr.group-child lib-table-checkbox-cell button') as HTMLButtonElement;
      rowCheck.click();
      redraw();
      expect(rowEvents.length).toBe(1);
      expect(groupEvents.length).toBe(1);
      expect(groupCheck(0)!.getAttribute('aria-checked')).toBe('mixed');
    });

    it('does not toggle the group when the selection column is not editable', () => {
      create({field: 'form', selectionField: 'isActive'}, true);
      expect(groupCheck(0)!.disabled).toBeTrue();
      groupCheck(0)!.click();
      expect(groupEvents.length).toBe(0);
    });

    it('keeps group headers while filtering and sorting', () => {
      create({field: 'form'});
      fixture.componentInstance.dataSource.filter = 'glucose';
      redraw();
      expect(headers().length).toBe(1);
      expect(dataRows().length).toBe(1);
      fixture.componentInstance.dataSource.filter = '';
      redraw();

      fixture.componentInstance.dataSource.sort!.sort({id: 'name', start: 'desc', disableClear: false});
      redraw();
      const names = dataRows().map(row => row.querySelector('td')!.textContent!.trim());
      expect(names).toEqual(['sex', 'age', 'urea', 'glucose', 'notes']);
    });
  });
});
