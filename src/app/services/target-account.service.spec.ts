import { TestBed } from '@angular/core/testing';

import { TargetAccountService } from './target-account.service';

describe('TargetAccountService', () => {
  let service: TargetAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TargetAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
