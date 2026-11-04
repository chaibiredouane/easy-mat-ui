import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatOptionSelectionChange } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';

import { EasyMultiSelect } from './easy-multi-select';

/** The part of the Material event that the component reads. */
function userPick(value: string, selected = true): MatOptionSelectionChange {
  return { isUserInput: true, source: { selected, value } } as unknown as MatOptionSelectionChange;
}

describe('EasyMultiSelect', () => {
  let component: EasyMultiSelect;
  let fixture: ComponentFixture<EasyMultiSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasyMultiSelect, TranslateModule.forRoot()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EasyMultiSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('multiple choice (default)', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(EasyMultiSelect);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('data', [{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta' }]);
      fixture.componentRef.setInput('valueField', 'id');
      fixture.componentRef.setInput('displayField', 'label');
      fixture.detectChanges();
    });

    it('keeps several values and emits them all', () => {
      const emitted: string[][] = [];
      component.change.subscribe((v) => emitted.push([...v]));
      component.onSelectionChange(userPick('a'));
      component.onSelectionChange(userPick('b'));
      expect(component.multiSelectControl.value).toEqual(['a', 'b']);
      expect(emitted.at(-1)).toEqual(['a', 'b']);
      expect(component.hidePlaceholder).toBeTrue();
    });
  });

  describe('single choice', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(EasyMultiSelect);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('single', true);
      fixture.componentRef.setInput('data', [{ id: 'dz', label: 'Algeria' }, { id: 'fr', label: 'France' }]);
      fixture.componentRef.setInput('valueField', 'id');
      fixture.componentRef.setInput('displayField', 'label');
      fixture.componentRef.setInput('selectedData', [{ id: 'dz', label: 'Algeria' }]);
      fixture.detectChanges();
    });

    it('holds the value itself, not an array', () => {
      expect(component.multiSelectControl.value as unknown).toBe('dz');
      expect(component.hidePlaceholder).toBeTrue();
    });

    it('replaces the previous choice and emits an array of one value', () => {
      const emitted: string[][] = [];
      component.change.subscribe((v) => emitted.push([...v]));
      component.onSelectionChange(userPick('fr'));
      expect(component.multiSelectControl.value as unknown).toBe('fr');
      expect(emitted).toEqual([['fr']]);
    });

    it('ignores the deselection event Material sends for the previous option', () => {
      const emitted: string[][] = [];
      component.change.subscribe((v) => emitted.push([...v]));
      component.onSelectionChange(userPick('dz', false));
      expect(emitted).toEqual([]);
      expect(component.multiSelectControl.value as unknown).toBe('dz');
    });

    it('follows a new selection and a new list given by the parent', () => {
      fixture.componentRef.setInput('data', [{ id: 'fr', label: 'France' }, { id: 'be', label: 'Belgium' }]);
      fixture.componentRef.setInput('selectedData', [{ id: 'be', label: 'Belgium' }]);
      fixture.detectChanges();
      expect(component.multiSelectControl.value as unknown).toBe('be');
      expect(component.data.map((d) => d['id'])).toEqual(['be', 'fr']); // sorted by label
    });

    it('can be reset', () => {
      component.resetSelection();
      expect(component.multiSelectControl.value).toBeNull();
      expect(component.hidePlaceholder).toBeFalse();
    });
  });
});
