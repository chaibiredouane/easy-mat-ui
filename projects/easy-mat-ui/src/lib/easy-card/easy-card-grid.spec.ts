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

  it('uses the minimum width and a fixed number of columns when asked', () => {
    expect(grid().style.getPropertyValue('--min')).toBe('240px');
    expect(grid().classList).not.toContain('fixed');
    fixture.componentRef.setInput('minWidth', 300);
    fixture.componentRef.setInput('columns', 3);
    fixture.detectChanges();
    expect(grid().style.getPropertyValue('--min')).toBe('300px');
    expect(grid().style.getPropertyValue('--columns')).toBe('3');
    expect(grid().classList).toContain('fixed');
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
