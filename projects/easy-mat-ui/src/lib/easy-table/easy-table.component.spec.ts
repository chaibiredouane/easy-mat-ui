import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';

import { EasyTableComponent } from './easy-table.component';
import { EasyTableConfig } from '../model/easy-table-config.model';
import { MatColumnTyped } from '../model/mat-column-typed.model';

@Component({ selector: 'lib-test-tab-content', standalone: true, template: '<p class="custom-tab-content">{{ label }}</p>' })
class TestTabContentComponent {
  @Input() label = '';
}

describe('EasyTableComponent', () => {
  let component: EasyTableComponent<any>;
  let fixture: ComponentFixture<EasyTableComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasyTableComponent, TranslateModule.forRoot()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EasyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('child tabs', () => {
    const parentRow = { id: 1, name: 'parent' };

    function expandWithChildTabs(childTabs: EasyTableConfig[]): void {
      fixture.componentRef.setInput('config', { data: [parentRow], displayedColumns: ['#', 'name', 'actions'], isExpanded: true });
      fixture.componentRef.setInput('childConfig', childTabs);
      component.expandedElement = parentRow;
      fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();
    }

    it('should render the default child table when no tab content is configured', () => {
      expandWithChildTabs([new EasyTableConfig({ data: [], tabTitle: 'Default', displayedColumns: ['name'] })]);

      expect(fixture.nativeElement.querySelector('lib-easy-table-basic')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('.custom-tab-content')).toBeNull();
    });

    it('should render the custom component instead of the child table when tab content is configured', () => {
      expandWithChildTabs([new EasyTableConfig({
        data: [],
        tabTitle: 'Custom',
        tabContent: TestTabContentComponent,
        tabContentInputs: { label: 'custom label' },
      })]);

      expect(fixture.nativeElement.querySelector('.custom-tab-content')?.textContent).toBe('custom label');
      expect(fixture.nativeElement.querySelector('lib-easy-table-basic')).toBeNull();
    });

    describe('leaving a child tab', () => {
      const tabGroup = () => ({ selectedIndex: 0 }) as unknown as MatTabGroup;

      it('should switch tabs when the tab has no leave guard', async () => {
        const group = tabGroup();

        await component.onChildTabChange(1, group);

        expect(component.childTabIndex).toBe(1);
      });

      it('should stay on the tab when the leave guard refuses', async () => {
        expandWithChildTabs([new EasyTableConfig({ data: [], canLeaveTab: () => false }), new EasyTableConfig({ data: [] })]);
        const group = tabGroup();

        await component.onChildTabChange(1, group);

        expect(component.childTabIndex).toBe(0);
        expect(group.selectedIndex).toBe(0);
      });

      it('should switch tabs when the asynchronous leave guard accepts', async () => {
        expandWithChildTabs([new EasyTableConfig({ data: [], canLeaveTab: () => Promise.resolve(true) }), new EasyTableConfig({ data: [] })]);
        const group = tabGroup();

        await component.onChildTabChange(1, group);

        expect(component.childTabIndex).toBe(1);
        expect(group.selectedIndex).toBe(1);
      });
    });
  });
});


describe('EasyTableComponent rows and search', () => {
  const columns = () => [new MatColumnTyped({ name: 'id' }), new MatColumnTyped({ name: 'name' })];

  async function render(data: any[], extra: Partial<EasyTableConfig> = {}) {
    await TestBed.configureTestingModule({ imports: [EasyTableComponent, TranslateModule.forRoot()] }).compileComponents();
    const fixture = TestBed.createComponent(EasyTableComponent);
    fixture.componentRef.setInput('config', new EasyTableConfig({ data, displayedColumns: columns(), changePageSize: 25, ...extra }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  const shownIds = (el: HTMLElement) =>
    Array.from(el.querySelectorAll('tr.mat-mdc-row'))
      .filter(row => (row.textContent ?? '').trim() !== '')
      .map(row => (row.querySelector('td')?.textContent ?? '').trim());

  it('does not reorder the array it receives', async () => {
    const data = [{ id: 3, name: 'c' }, { id: 1, name: 'a' }, { id: 2, name: 'b' }];
    const fixture = await render(data);
    expect(data.map(row => row.id)).toEqual([3, 1, 2]);
    expect(shownIds(fixture.nativeElement)).toEqual(['1', '2', '3']);
  });

  it('accepts a frozen array', async () => {
    const data = Object.freeze([{ id: 2, name: 'b' }, { id: 1, name: 'a' }]) as any[];
    const fixture = await render(data);
    expect(shownIds(fixture.nativeElement)).toEqual(['1', '2']);
  });

  it('orders numeric ids as numbers', async () => {
    const data = Array.from({ length: 12 }, (_, i) => ({ id: 12 - i, name: 'n' + i }));
    const fixture = await render(data);
    expect(shownIds(fixture.nativeElement)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
  });

  it('keeps the order of the application when sortedBy is empty', async () => {
    const data = [{ id: 3, name: 'c' }, { id: 1, name: 'a' }, { id: 2, name: 'b' }];
    const fixture = await render(data, { sortedBy: '' });
    expect(shownIds(fixture.nativeElement)).toEqual(['3', '1', '2']);
  });

  it('filters on the input event alone, without any keyup', async () => {
    const fixture = await render([{ id: 1, name: 'alice' }, { id: 2, name: 'bob' }]);
    const el: HTMLElement = fixture.nativeElement;
    const input = el.querySelector('.toolbar-search input') as HTMLInputElement;
    input.value = 'bob';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(shownIds(el)).toEqual(['2']);
  });
});
