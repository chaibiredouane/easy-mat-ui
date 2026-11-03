import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { EasyTableComponent } from './easy-table.component';

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
});
