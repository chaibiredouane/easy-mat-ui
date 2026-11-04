import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyChipNavItem } from '../model/easy-chip-nav.model';
import { EasyChipNav } from './easy-chip-nav';

const ITEMS: EasyChipNavItem[] = [
  { id: 'all', label: 'All', icon: 'public', count: 194 },
  { id: 'africa', label: 'Africa', icon: 'wb_sunny', color: '#b45309', count: 54 },
  { id: 'none', label: 'Empty', count: 0, disabled: true },
  { id: 'plain', label: 'No count' }
];

describe('EasyChipNav', () => {
  let fixture: ComponentFixture<EasyChipNav>;
  let component: EasyChipNav;
  const buttons = () => Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [EasyChipNav] }).compileComponents();
    fixture = TestBed.createComponent(EasyChipNav);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', ITEMS);
    fixture.componentRef.setInput('selected', 'all');
    fixture.componentRef.setInput('ariaLabel', 'Browse by continent');
    fixture.detectChanges();
  });

  it('shows a button per item with its text, its count and the pressed state', () => {
    expect(buttons().length).toBe(4);
    expect(buttons()[0].textContent).toContain('All');
    expect(buttons()[0].querySelector('.n')?.textContent?.trim()).toBe('194');
    expect(buttons().map((b) => b.getAttribute('aria-pressed'))).toEqual(['true', 'false', 'false', 'false']);
    expect(fixture.nativeElement.querySelector('nav').getAttribute('aria-label')).toBe('Browse by continent');
  });

  it('shows a count of zero, and no count when there is none', () => {
    expect(buttons()[2].querySelector('.n')?.textContent?.trim()).toBe('0');
    expect(buttons()[3].querySelector('.n')).toBeNull();
  });

  it('gives a coloured item its colour', () => {
    expect(buttons()[1].classList).toContain('colored');
    expect(buttons()[1].style.getPropertyValue('--c')).toBe('#b45309');
    expect(buttons()[0].classList).not.toContain('colored');
  });

  it('emits the id of the item that is chosen, and nothing for the same one or a disabled one', () => {
    const emitted: string[] = [];
    component.selectedChange.subscribe((id) => emitted.push(id));
    buttons()[0].click();
    buttons()[2].click();
    buttons()[1].click();
    expect(emitted).toEqual(['africa']);
  });
});
