import { TestBed } from '@angular/core/testing';

import { YeelightService } from './yeelight.service';

describe('YeelightService', () => {
  let service: YeelightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YeelightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
