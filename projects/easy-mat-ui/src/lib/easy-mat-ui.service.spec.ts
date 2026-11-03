import { TestBed } from '@angular/core/testing';

import { EasyMatUiService } from './easy-mat-ui.service';

describe('EasyMatUiService', () => {
  let service: EasyMatUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EasyMatUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
