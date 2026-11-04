import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyCardConfig } from '../model/easy-card.model';
import { EasyCardGrid } from './easy-card-grid';

const ITEMS: EasyCardConfig[] = [
  { id: 'a', title: 'A', clickable: true },
  { id: 'b', title: 'B', actions: [{ id: 'go', label: 'Go' }] },
  { title: 'C without id' }
];

describe('EasyCardGrid', () => {
  let fixture: ComponentFixture<EasyCardGrid>;
  let component: EasyCardGrid;
  const grid = (): HTMLElement => fixture.nativeElement.querySelector('.grid');

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [EasyCardGrid] }).compileComponents();
    fixture = TestBed.createComponent(EasyCardGrid);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', ITEMS);
    fixture.detectChanges();
  });

  it('shows one card per item', () => {
    expect(fixture.nativeElement.querySelectorAll('lib-easy-card').length).toBe(3);
  });

  it('uses the minimum width and the most columns that are asked', () => {
    expect(grid().style.getPropertyValue('--min')).toBe('240px');
    expect(grid().style.getPropertyValue('--columns')).toBe('12');
    fixture.componentRef.setInput('minWidth', 300);
    fixture.componentRef.setInput('columns', 3);
    fixture.detectChanges();
    expect(grid().style.getPropertyValue('--min')).toBe('300px');
    expect(grid().style.getPropertyValue('--columns')).toBe('3');
  });

  it('never has more columns than the cards fit, whatever the limit', () => {
    fixture.nativeElement.style.width = '600px';
    fixture.componentRef.setInput('minWidth', 240);
    fixture.componentRef.setInput('columns', 3);
    fixture.detectChanges();
    const tops = new Set(Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('lib-easy-card')).map((c) => Math.round(c.getBoundingClientRect().top)));
    // 600px at 240px per card: two columns, so the three cards are on two rows.
    expect(tops.size).toBe(2);
  });

  it('passes the events of the cards up', () => {
    const clicked: EasyCardConfig[] = [];
    const used: string[] = [];
    component.cardClick.subscribe((card) => clicked.push(card));
    component.actionClick.subscribe((event) => used.push(event.action.id));
    (fixture.nativeElement.querySelector('button.card') as HTMLButtonElement).click();
    (fixture.nativeElement.querySelector('button.action') as HTMLButtonElement).click();
    expect(clicked).toEqual([ITEMS[0]]);
    expect(used).toEqual(['go']);
  });
});
