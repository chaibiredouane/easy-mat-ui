import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatColumnTyped } from '../model/mat-column-typed.model';
import { EasyTableComponent } from './easy-table.component';

describe('EasyTableComponent headerClass', () => {
  let fixture: ComponentFixture<EasyTableComponent<any>>;

  const header = (name: string): HTMLElement => fixture.nativeElement.querySelector(`th.mat-column-${name}`);
  const cell = (name: string): HTMLElement => fixture.nativeElement.querySelector(`td.mat-column-${name}`);

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [EasyTableComponent, TranslateModule.forRoot()] }).compileComponents();
    fixture = TestBed.createComponent(EasyTableComponent);
    fixture.componentInstance.config = {
      data: [{ id: 1, flag: 'fr', name: 'Alice' }],
      sortedBy: '',
      displayedColumns: [
        new MatColumnTyped({ name: 'flag', headerClass: 'text-center' }),
        new MatColumnTyped({ name: 'name' })
      ]
    };
    fixture.detectChanges();
  });

  it('is empty by default, so existing tables look as before', () => {
    expect(new MatColumnTyped({ name: 'x' }).headerClass).toBe('');
  });

  it('adds the class to the header of that column only', () => {
    expect(header('flag').classList).toContain('text-center');
    expect(header('flag').classList).toContain('has-header-class');
    expect(header('name').classList).not.toContain('text-center');
    expect(header('name').classList).not.toContain('has-header-class');
  });

  it('does not add the class to the cells of the column', () => {
    expect(cell('flag').classList).not.toContain('text-center');
  });
});
