import {ComponentFixture, TestBed} from '@angular/core/testing';
import {EasyFileUpload} from './easy-file-upload';
import {EasyFileUploadResult} from '../model/easy-file-upload.model';
import {EasyFileUploadTableOutput} from '../model/easy-file-upload.model';

describe('EasyFileUpload', () => {
  let fixture: ComponentFixture<EasyFileUpload>;
  let component: EasyFileUpload;

  const csvFile = (content: string, name = 'data.csv') => new File([content], name, {type: 'text/csv'});
  const select = (files: File[]) => (component as any).addFiles(files);
  const settle = async (): Promise<EasyFileUploadResult> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return (component as any).buildResult();
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(EasyFileUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('rejects files outside accept and above the size limit', () => {
    component.multiple = true;
    component.accept = '.csv';
    component.maxFileSize = 10;
    select([new File(['x'], 'a.pdf'), csvFile('a'.repeat(20))]);
    expect(component.errors().map(error => error.code)).toEqual(['type', 'size']);
    expect(component.items().length).toBe(0);
  });

  it('enforces maxFiles and duplicates in multiple mode', () => {
    component.multiple = true;
    component.maxFiles = 1;
    component.parse = false;
    select([csvFile('a,b', 'one.csv'), csvFile('a,b', 'two.csv')]);
    expect(component.items().length).toBe(1);
    expect(component.errors()[0].code).toBe('max-files');
  });

  it('returns raw parsed csv with detected separator and header', async () => {
    select([csvFile('name;age\nAnn;30\nBob;25')]);
    const result = await settle();
    expect(result.status).toBe('success');
    expect(result.delimiter).toBe(';');
    expect(result.hasHeader).toBeTrue();
    expect(result.output.records.length).toBe(2);
  });

  it('builds EasyTable output with parent-child structure', async () => {
    component.outputMode = 'easy-table';
    component.parentColumn = 'team';
    select([csvFile('team,name\nA,Ann\nA,Bob\nB,Cy')]);
    const result = await settle();
    const output = result.output as EasyFileUploadTableOutput;
    expect(output.config.data.length).toBe(2);
    expect(output.config.data[0]['children'].length).toBe(2);
    expect(output.childConfig?.data.length).toBe(3);
  });

  it('builds EasyBasicTable output without headers', async () => {
    component.outputMode = 'easy-basic-table';
    component.withHeader = false;
    select([csvFile('1,2\n3,4')]);
    const result = await settle();
    const output = result.output as EasyFileUploadTableOutput;
    expect(output.displayedColumns.map(column => column.name)).toEqual(['column_1', 'column_2']);
    expect(output.dataSource.data.length).toBe(2);
  });

  it('reports parse errors for table modes on unsupported files', async () => {
    component.outputMode = 'easy-table';
    select([new File(['hello'], 'note.pdf', {type: 'application/pdf'})]);
    const result = await settle();
    expect(result.status).toBe('error');
    expect(result.errors[0].code).toBe('parse');
  });

  it('resolves interaction modes consistently', () => {
    expect(component.resolvedMode).toBe('drag-drop');
    component.layout = 'field';
    expect(component.resolvedMode).toBe('both');
    component.mode = 'button';
    expect(component.acceptsDrops).toBeFalse();
    component.mode = 'both';
    component.showButton = false;
    expect(component.resolvedMode).toBe('drag-drop');
    component.showDropArea = false;
    component.showButton = true;
    expect(component.resolvedMode).toBe('button');
    component.showButton = false;
    expect(component.resolvedMode).toBe('drag-drop');
  });

  it('ignores drops in button mode', () => {
    component.mode = 'button';
    component.parse = false;
    const event = {preventDefault: () => undefined, dataTransfer: {files: [csvFile('a')]}} as unknown as DragEvent;
    component.onDrop(event);
    expect(component.items().length).toBe(0);
  });

  it('handles duplicates according to the configured strategy', () => {
    component.multiple = true;
    component.parse = false;
    select([csvFile('a', 'same.csv')]);
    select([csvFile('a', 'same.csv')]);
    expect(component.errors()[0].code).toBe('duplicate');
    component.duplicates = 'replace';
    select([csvFile('a', 'same.csv')]);
    expect(component.items().length).toBe(1);
    component.duplicates = 'allow';
    select([csvFile('a', 'same.csv')]);
    expect(component.items().length).toBe(2);
  });
});
