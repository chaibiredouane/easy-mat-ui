import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { EasyMultiSelect } from './easy-multi-select';

describe('EasyMultiSelect', () => {
  let component: EasyMultiSelect;
  let fixture: ComponentFixture<EasyMultiSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasyMultiSelect, TranslateModule.forRoot()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EasyMultiSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
