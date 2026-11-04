import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasySegmentedOption } from '../model/easy-segmented.model';
import { EasySegmented } from './easy-segmented';

const OPTIONS: EasySegmentedOption[] = [
  { id: 'auto', label: 'Auto' },
  { id: 'units', label: 'Units' },
  { id: 'off', label: 'Off', disabled: true },
  { id: 'millions', label: 'Millions', icon: 'bar_chart', hint: 'Always in M' }
];

describe('EasySegmented', () => {
  let fixture: ComponentFixture<EasySegmented>;
  let component: EasySegmented;
  const buttons = () => Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [EasySegmented] }).compileComponents();
    fixture = TestBed.createComponent(EasySegmented);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', OPTIONS);
    fixture.componentRef.setInput('selected', 'auto');
    fixture.detectChanges();
  });

  it('shows one button per option and marks the chosen one', () => {
    expect(buttons().length).toBe(4);
    expect(buttons().map((b) => b.getAttribute('aria-checked'))).toEqual(['true', 'false', 'false', 'false']);
    expect(fixture.nativeElement.querySelector('[role="radiogroup"]')).toBeTruthy();
  });

  it('emits the id of the option that is used, and not twice for the same one', () => {
    const emitted: string[] = [];
    component.selectedChange.subscribe((id) => emitted.push(id));
    buttons()[1].click();
    buttons()[1].click();
    expect(emitted).toEqual(['units']);
  });

  it('does not choose a disabled option', () => {
    const emitted: string[] = [];
    component.selectedChange.subscribe((id) => emitted.push(id));
    component.select(OPTIONS[2]);
    expect(emitted).toEqual([]);
  });

  it('moves the choice with the arrow keys and skips the disabled options', () => {
    const emitted: string[] = [];
    component.selectedChange.subscribe((id) => emitted.push(id));
    component.selected = 'units';
    component.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(emitted).toEqual(['millions']); // "off" is disabled
    component.onKeydown(new KeyboardEvent('keydown', { key: 'Home' }));
    expect(emitted).toEqual(['millions', 'auto']);
  });

  it('only lets the chosen button be reached with the Tab key', () => {
    expect(buttons().map((b) => b.getAttribute('tabindex'))).toEqual(['0', '-1', '-1', '-1']);
  });

  it('uses the tab semantics for pages', () => {
    fixture.componentRef.setInput('semantics', 'tab');
    fixture.componentRef.setInput('panelId', 'panel');
    fixture.componentRef.setInput('idPrefix', 'tab-');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="tablist"]')).toBeTruthy();
    expect(buttons()[0].getAttribute('role')).toBe('tab');
    expect(buttons()[0].getAttribute('aria-selected')).toBe('true');
    expect(buttons()[0].getAttribute('aria-controls')).toBe('panel');
    expect(buttons()[0].id).toBe('tab-auto');
  });

  it('keeps an accessible name when only icons are shown', () => {
    fixture.componentRef.setInput('iconOnly', true);
    fixture.detectChanges();
    expect(buttons()[3].getAttribute('aria-label')).toBe('Always in M');
    expect(buttons()[0].getAttribute('aria-label')).toBe('Auto');
    expect(fixture.nativeElement.querySelector('.txt')).toBeNull();
  });
});
