import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyMatUiComponent } from './easy-mat-ui.component';

describe('EasyMatUiComponent', () => {
  let component: EasyMatUiComponent;
  let fixture: ComponentFixture<EasyMatUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasyMatUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EasyMatUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
