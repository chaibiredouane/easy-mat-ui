import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { EasyTableBasicComponent } from './easy-table-basic.component';

describe('EasyTableBasic', () => {
  let component: EasyTableBasicComponent<any>;
  let fixture: ComponentFixture<EasyTableBasicComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasyTableBasicComponent, TranslateModule.forRoot()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EasyTableBasicComponent);
    component = fixture.componentInstance;
    component.config = { data: [] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
