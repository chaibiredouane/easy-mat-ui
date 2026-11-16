import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ToolbarConfig, ToolbarSaveState } from '../../model/toolbar-config.model';
import { TableToolbarComponent } from './table-toolbar';

describe('TableToolbarComponent save action', () => {
  let fixture: ComponentFixture<TableToolbarComponent>;
  let component: TableToolbarComponent;

  const render = (saveState: ToolbarSaveState | null): HTMLButtonElement | null => {
    fixture.componentRef.setInput('config', new ToolbarConfig({ saveState }));
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('.toolbar-save');
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TableToolbarComponent, TranslateModule.forRoot()] }).compileComponents();
    fixture = TestBed.createComponent(TableToolbarComponent);
    component = fixture.componentInstance;
  });

  it('should not render the save button without a save state', () => {
    expect(render(null)).toBeNull();
  });

  it('should emit save only when changes are pending or the last save failed', () => {
    const emitted: unknown[] = [];
    component.save.subscribe(() => emitted.push(true));

    render('pending')!.click();
    render('error')!.click();
    render('saving')!.click();
    render('saved')!.click();

    expect(emitted.length).toBe(2);
  });

  it('should show the matching icon for each state', () => {
    const icons = (['pending', 'saving', 'saved', 'error'] as const).map(state => render(state)!.querySelector('mat-icon')!.textContent!.trim());

    expect(icons).toEqual(['save', 'sync', 'check', 'priority_high']);
  });
});
