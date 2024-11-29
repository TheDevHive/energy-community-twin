import { TestBed } from '@angular/core/testing';

import { EnergyReportService } from './energy-report.service';

describe('EnergyReportService', () => {
  let service: EnergyReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnergyReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
