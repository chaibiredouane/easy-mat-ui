import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { EasyTableConfig } from '../model/easy-table-config.model';
import { ToolbarConfig } from '../model/toolbar-config.model';
import { EasyTableBasicComponent } from './easy-table-basic.component';

describe('EasyTableBasicComponent toolbar custom action', () => {
  const clickCustomAction = (config: EasyTableConfig): number => {
    TestBed.configureTestingModule({ imports: [EasyTableBasicComponent, TranslateModule.forRoot()] });
    const fixture = TestBed.createComponent(EasyTableBasicComponent);
    let emitted = 0;
    fixture.componentInstance.customAction.subscribe(() => emitted++);
    fixture.componentRef.setInput('config', config);
    fixture.detectChanges();
    const buttons = Array.from(fixture.nativeElement.querySelectorAll('.toolbar-actions button')) as HTMLButtonElement[];
    buttons.find(button => button.textContent?.includes('upload_file'))?.click();
    return emitted;
  };

  const configWith = (toolbarConfig: ToolbarConfig, tableCustomActionEnable = false) =>
    new EasyTableConfig({ data: [], withToolbar: true, displayedColumns: ['name'], customActionEnable: tableCustomActionEnable, toolbarConfig });

  it('should emit customAction when only the toolbar enables the action', () => {
    const toolbarConfig = new ToolbarConfig({ customActionEnable: true, customActionIcon: 'upload_file' });

    expect(clickCustomAction(configWith(toolbarConfig))).toBe(1);
  });

  it('should keep emitting customAction when the table config enables the action', () => {
    const toolbarConfig = new ToolbarConfig({ customActionEnable: true, customActionIcon: 'upload_file' });

    expect(clickCustomAction(configWith(toolbarConfig, true))).toBe(1);
  });

  it('should not render the action when it is disabled', () => {
    expect(clickCustomAction(configWith(new ToolbarConfig({ customActionIcon: 'upload_file' })))).toBe(0);
  });
});
