import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {EasyDialogComponent} from './easy-dialog.component';
import {EasyDialogInit} from '../model/easy-dialog-config.model';
import {MatColumnTyped} from '../model/mat-column-typed.model';
import {CRUD, InputType} from '../utils/enums';

describe('EasyDialogComponent', () => {
  let fixture: ComponentFixture<EasyDialogComponent>;
  let component: EasyDialogComponent;
  let backdrop$: Subject<MouseEvent>;
  let keydown$: Subject<KeyboardEvent>;
  let dialogRef: any;

  const countries = [{id: 1, label: 'Luxembourg'}, {id: 2, label: 'France'}];

  function create(config: EasyDialogInit) {
    backdrop$ = new Subject();
    keydown$ = new Subject();
    dialogRef = {
      disableClose: false,
      close: jasmine.createSpy('close'),
      backdropClick: () => backdrop$.asObservable(),
      keydownEvents: () => keydown$.asObservable()
    };

    TestBed.configureTestingModule({
      imports: [EasyDialogComponent, TranslateModule.forRoot()],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: config},
        {provide: MatDialogRef, useValue: dialogRef}
      ]
    });
    fixture = TestBed.createComponent(EasyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  const baseConfig = (): EasyDialogInit => ({
    title: 'TITLE',
    pk: 'id',
    data: {id: 'A1', name: 'Alice', country: 1},
    fields: [
      new MatColumnTyped({name: 'id', order: 1}),
      new MatColumnTyped({name: 'name', order: 2}),
      new MatColumnTyped({
        name: 'country', order: 3, inputType: InputType.Dropdown,
        filterList: countries, filterValue: 'id', displayColumn: 'label'
      })
    ]
  });

  it('groups fields into rows of at most 12 columns', () => {
    create({
      ...baseConfig(),
      fields: [
        new MatColumnTyped({name: 'a', gridSize: 8, order: 1}),
        new MatColumnTyped({name: 'b', gridSize: 6, order: 2}),
        new MatColumnTyped({name: 'c', gridSize: 4, order: 3})
      ]
    });
    expect(component.groupedFields.map(r => r.map(c => c.name))).toEqual([['a'], ['b', 'c']]);
  });

  it('does not mutate the caller data and disables escape/backdrop closing', () => {
    const cfg = baseConfig();
    create(cfg);
    component.data['name'] = 'Bob';
    expect((cfg.data as any).name).toBe('Alice');
    expect(dialogRef.disableClose).toBeTrue();
  });

  it('closes with the action and edited data on save', () => {
    create(baseConfig());
    component.data['name'] = 'Bob';
    component.doAction();
    expect(dialogRef.close).toHaveBeenCalledWith({event: CRUD.UPDATE, data: jasmine.objectContaining({name: 'Bob'})});
  });

  it('disables save while the primary key is empty', () => {
    create({...baseConfig(), data: {id: '', name: 'Alice', country: 1}});
    const save: HTMLButtonElement = fixture.nativeElement.querySelector('.bg-green');
    expect(save.disabled).toBeTrue();
  });

  it('supports a custom validate function', () => {
    create({...baseConfig(), validate: d => d['name'] === 'ok'});
    expect(component.isInvalidForm()).toBeTrue();
    component.data['name'] = 'ok';
    expect(component.isInvalidForm()).toBeFalse();
  });

  it('keeps save disabled until every required field is filled', () => {
    create({
      data: {code: '', name: ''},
      fields: [
        new MatColumnTyped({name: 'code', isRequired: true}),
        new MatColumnTyped({name: 'name', isRequired: true}),
        new MatColumnTyped({name: 'note'})
      ]
    });
    expect(component.isInvalidForm()).toBeTrue();

    component.data['code'] = 'A1';
    expect(component.isInvalidForm()).toBeTrue();

    component.data['name'] = 'Alice';
    expect(component.isInvalidForm()).toBeFalse();
  });

  it('does not require read-only fields', () => {
    create({
      data: {code: ''},
      fields: [new MatColumnTyped({name: 'code', isRequired: true, readonly: true})]
    });
    expect(component.isInvalidForm()).toBeFalse();
  });

  it('builds the header label from the action, with an English fallback', () => {
    create({...baseConfig(), action: CRUD.CREATE});
    expect(component.actionLabel).toBe('Create');
    expect(component.icon).toBe('add');
  });

  it('uses translated action labels when provided', () => {
    create({...baseConfig(), action: CRUD.READ, translations: {actions: {[CRUD.READ]: 'Consultation'}}});
    expect(component.actionLabel).toBe('Consultation');
    expect(component.icon).toBe('visibility');
  });

  it('appends the titleField value to the title subject', () => {
    create({...baseConfig(), title: 'Referential', titleField: 'name'});
    expect(component.subject).toBe('Referential — Alice');

    component.data['name'] = '';
    expect(component.subject).toBe('Referential');
  });

  it('hides the save button in read mode', () => {
    create({...baseConfig(), action: CRUD.READ});
    expect(fixture.nativeElement.querySelector('.bg-green')).toBeNull();
  });

  it('closes immediately with Cancel when nothing changed', () => {
    create(baseConfig());
    component.closeDialog();
    expect(dialogRef.close).toHaveBeenCalledWith({event: 'Cancel'});
  });

  it('asks for confirmation when closing with unsaved changes', () => {
    create(baseConfig());
    component.data['name'] = 'Bob';
    keydown$.next(new KeyboardEvent('keydown', {key: 'Escape'}));
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.confirmingClose()).toBeTrue();

    component.discardChanges();
    expect(dialogRef.close).toHaveBeenCalledWith({event: 'Cancel'});
  });

  it('ignores backdrop clicks in modal mode', () => {
    create(baseConfig());
    component.data['name'] = 'Bob';
    backdrop$.next(new MouseEvent('click'));
    expect(component.confirmingClose()).toBeFalse();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('routes backdrop clicks through the close flow when not modal', () => {
    create({...baseConfig(), modal: false});
    backdrop$.next(new MouseEvent('click'));
    expect(dialogRef.close).toHaveBeenCalledWith({event: 'Cancel'});
  });

  it('saves from the confirmation, or reports an incomplete form', () => {
    create({...baseConfig(), modal: false});
    component.data['name'] = 'Bob';
    backdrop$.next(new MouseEvent('click'));
    component.confirmSave();
    expect(dialogRef.close).toHaveBeenCalledWith({event: CRUD.UPDATE, data: jasmine.objectContaining({name: 'Bob'})});

    dialogRef.close.calls.reset();
    component.data['id'] = '';
    component.confirmSave();
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.formError()).toBeTrue();
  });

  it('skips the confirmation when confirmOnClose is false', () => {
    create({...baseConfig(), confirmOnClose: false});
    component.data['name'] = 'Bob';
    component.closeDialog();
    expect(dialogRef.close).toHaveBeenCalledWith({event: 'Cancel'});
  });

  it('returns the clicked extra action id with the data', () => {
    create({...baseConfig(), extraActions: [{id: 'duplicate', icon: 'content_copy'}]});
    fixture.detectChanges();
    component.onExtraAction(component.visibleActions[0]);
    expect(dialogRef.close).toHaveBeenCalledWith({event: 'duplicate', data: jasmine.any(Object)});
  });

  it('initialises and updates dropdown fields', () => {
    create(baseConfig());
    const ddl = component.dropdowns['country'];
    expect(ddl.control.value).toEqual(countries[0]);

    ddl.control.setValue(countries[1]);
    expect(component.data['country']).toBe(2);

    ddl.control.setValue('');
    expect(component.data['country']).toBeNull();
  });

  it('keeps the date part and falls back to the column name for untranslated headers', () => {
    create(baseConfig());
    const col = new MatColumnTyped({name: 'when'});
    component.data['when'] = '2026-10-07T10:11:12';
    expect(component.getDateValue(col)).toBe('2026-10-07');
    expect(component.getHeaderName('name')).toBe('name');
  });
});
