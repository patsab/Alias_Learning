import { TestBed } from '@angular/core/testing';

import { StatistikService } from './statistik.service';

describe('StatistikService', () => {
  let service: StatistikService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatistikService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
