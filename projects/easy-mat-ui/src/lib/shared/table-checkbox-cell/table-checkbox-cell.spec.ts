import {Type} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';
import {EasyTableComponent} from '../../easy-table/easy-table.component';
import {EasyTableBasicComponent} from '../../easy-table-basic/easy-table-basic.component';
import {EasyTableConfig} from '../../model/easy-table-config.model';
import {EasyTableSelectionChange} from '../../model/easy-table-selection.model';
import {MatColumnTyped} from '../../model/mat-column-typed.model';
import {ColumnType} from '../../utils/enums';

type Host = EasyTableComponent<any> | EasyTableBasicComponent<any>;

function buildConfig(columns: Partial<MatColumnTyped>[], readonly = false): EasyTableConfig {
  return new EasyTableConfig({
    readonly,
    withToolbar: false,
    data: [
      {id: 1, name: 'Admin', isActive: true, isLocked: false},
      {id: 2, name: 'Guest', isActive: false, isLocked: false}
    ],
    displayedColumns: [
      new MatColumnTyped({name: 'name', type: ColumnType.TEXT}),
      ...columns.map(column => new MatColumnTyped({type: ColumnType.Checkbox, ...column}))
    ]
  });
}

const componentTypes: Type<Host>[] = [EasyTableBasicComponent, EasyTableComponent];

componentTypes.forEach(componentType => {
  describe(`Checkbox column in ${componentType.name}`, () => {
    let fixture: ComponentFixture<Host>;
    let events: EasyTableSelectionChange[];

    function create(config: EasyTableConfig): void {
      fixture = TestBed.createComponent(componentType);
      events = [];
      fixture.componentInstance.selectionChange.subscribe((event: EasyTableSelectionChange) => events.push(event));
      fixture.componentRef.setInput('config', config);
      fixture.detectChanges();
    }

    function buttons(): HTMLButtonElement[] {
      return Array.from(fixture.nativeElement.querySelectorAll('lib-table-checkbox-cell button'));
    }

    beforeEach(() => TestBed.configureTestingModule({imports: [componentType, TranslateModule.forRoot()]}));

    it('toggles the value and emits one event per click', () => {
      create(buildConfig([{name: 'isActive', selection: {enabled: true}}]));
      const [admin] = buttons();
      expect(admin.getAttribute('aria-checked')).toBe('true');

      admin.click();
      fixture.detectChanges();
      expect(events.length).toBe(1);
      expect(events[0].field).toBe('isActive');
      expect(events[0].row.name).toBe('Admin');
      expect(events[0].value).toBe(false);
      expect(events[0].previousValue).toBe(true);
      expect(admin.getAttribute('aria-checked')).toBe('false');

      admin.click();
      fixture.detectChanges();
      expect(events.length).toBe(2);
      expect(events[1].value).toBe(true);
      expect(events[1].previousValue).toBe(false);
      expect(admin.getAttribute('aria-checked')).toBe('true');
    });

    it('is not interactive unless selection is enabled', () => {
      create(buildConfig([{name: 'isActive'}]));
      const [admin] = buttons();
      expect(admin.disabled).toBeTrue();
      admin.click();
      expect(events.length).toBe(0);
    });

    it('respects column readonly, table readonly and disabledFn', () => {
      create(buildConfig([
        {name: 'isActive', selection: {enabled: true}, readonly: true},
        {name: 'isLocked', selection: {enabled: true, disabledFn: row => row.id === 1}}
      ]));
      const [adminActive, adminLocked, guestActive, guestLocked] = buttons();
      expect(adminActive.disabled).toBeTrue();
      expect(guestActive.disabled).toBeTrue();
      expect(adminLocked.disabled).toBeTrue();
      expect(guestLocked.disabled).toBeFalse();

      create(buildConfig([{name: 'isActive', selection: {enabled: true}}], true));
      expect(buttons()[0].disabled).toBeTrue();
    });

    it('keeps several checkbox columns independent', () => {
      create(buildConfig([
        {name: 'isActive', selection: {enabled: true}},
        {name: 'isLocked', selection: {enabled: true}}
      ]));
      const [, adminLocked] = buttons();
      adminLocked.click();
      fixture.detectChanges();
      expect(events.length).toBe(1);
      expect(events[0].field).toBe('isLocked');
      expect(events[0].previousValue).toBe(false);
      expect(events[0].row.isActive).toBeTrue();
    });
  });
});
