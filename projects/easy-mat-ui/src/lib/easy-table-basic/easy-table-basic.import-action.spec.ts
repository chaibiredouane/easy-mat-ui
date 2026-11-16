import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { EasyTableConfig } from '../model/easy-table-config.model';
import { EasyTableBasicComponent } from './easy-table-basic.component';

describe('EasyTableBasicComponent toolbar import action', () => {
  const render = (canImport: boolean) => {
    TestBed.configureTestingModule({ imports: [EasyTableBasicComponent, TranslateModule.forRoot()] });
    const fixture = TestBed.createComponent(EasyTableBasicComponent);
    let importRequests = 0;
    fixture.componentInstance.importData.subscribe(() => importRequests++);
    fixture.componentRef.setInput('config', new EasyTableConfig({ data: [], withToolbar: true, displayedColumns: ['name'], canImport }));
    fixture.detectChanges();
    const importButton = Array.from(fixture.nativeElement.querySelectorAll('.toolbar-actions button') as NodeListOf<HTMLButtonElement>)
      .find(button => button.textContent?.includes('upload_file'));
    return { importButton, importRequests: () => importRequests };
  };

  it('should render the import button and emit importData when canImport is enabled', () => {
    const { importButton, importRequests } = render(true);

    importButton!.click();

    expect(importRequests()).toBe(1);
  });

  it('should not render the import button by default', () => {
    expect(render(false).importButton).toBeUndefined();
  });
});
