import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyLanguage } from '../model/easy-language-switch.model';
import { EasyLanguageSwitch } from './easy-language-switch';

const LANGUAGES: EasyLanguage[] = [
  { code: 'en', name: 'English', flag: 'gb' },
  { code: 'ar', name: 'العربية', flag: 'dz', short: 'ع' },
  { code: 'fr', name: 'Français', flagUrl: '/flags/fr.png' }
];

describe('EasyLanguageSwitch', () => {
  let fixture: ComponentFixture<EasyLanguageSwitch>;
  let component: EasyLanguageSwitch;
  const el = (selector: string): HTMLElement | null => fixture.nativeElement.querySelector(selector);
  const all = (selector: string): HTMLElement[] => Array.from(fixture.nativeElement.querySelectorAll(selector));

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [EasyLanguageSwitch] }).compileComponents();
    fixture = TestBed.createComponent(EasyLanguageSwitch);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('languages', LANGUAGES);
    fixture.componentRef.setInput('selected', 'ar');
    fixture.componentRef.setInput('ariaLabel', 'Choose the language');
    fixture.detectChanges();
  });

  it('shows the flag and the name of the chosen language in the menu button', () => {
    const trigger = el('button.trigger')!;
    expect(trigger.textContent).toContain('العربية');
    expect(trigger.querySelector('.flag')?.className).toContain('fi-dz');
    expect(trigger.getAttribute('aria-label')).toBe('Choose the language: العربية');
  });

  it('falls back to the first language when none is chosen', () => {
    fixture.componentRef.setInput('selected', null);
    fixture.detectChanges();
    expect(el('button.trigger')!.textContent).toContain('English');
  });

  it('shows only the flag, only the code, or only the name', () => {
    fixture.componentRef.setInput('display', 'flag');
    fixture.detectChanges();
    expect(el('button.trigger .name')).toBeNull();
    expect(el('button.trigger .flag')).toBeTruthy();

    fixture.componentRef.setInput('display', 'code');
    fixture.detectChanges();
    expect(el('button.trigger .name')!.textContent!.trim()).toBe('ع'); // the "short" text of the language
    expect(el('button.trigger .flag')).toBeNull();

    fixture.componentRef.setInput('display', 'name');
    fixture.detectChanges();
    expect(el('button.trigger .name')!.textContent!.trim()).toBe('العربية');
  });

  it('uses the code in capital letters when a language has no short text', () => {
    fixture.componentRef.setInput('selected', 'en');
    fixture.componentRef.setInput('display', 'code');
    fixture.detectChanges();
    expect(el('button.trigger .name')!.textContent!.trim()).toBe('EN');
  });

  it('shows an image flag when there is a flagUrl', () => {
    fixture.componentRef.setInput('layout', 'inline');
    fixture.detectChanges();
    expect(all('button.lang')[2].querySelector('img.flag')).toBeTruthy();
  });

  it('shows every language at once with the inline layout and marks the chosen one', () => {
    fixture.componentRef.setInput('layout', 'inline');
    fixture.detectChanges();
    expect(all('button.lang').length).toBe(3);
    expect(all('button.lang').map((b) => b.getAttribute('aria-checked'))).toEqual(['false', 'true', 'false']);
    expect(el('[role="radiogroup"]')!.getAttribute('aria-label')).toBe('Choose the language');
  });

  it('emits the code of the language that is chosen, and nothing for the same one', () => {
    fixture.componentRef.setInput('layout', 'inline');
    fixture.detectChanges();
    const emitted: string[] = [];
    component.selectedChange.subscribe((code) => emitted.push(code));
    all('button.lang')[1].click();
    all('button.lang')[2].click();
    expect(emitted).toEqual(['fr']);
  });
});
