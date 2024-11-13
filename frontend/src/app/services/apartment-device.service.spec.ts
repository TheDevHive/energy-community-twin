import { TestBed } from '@angular/core/testing';

import { ApartmentDeviceService } from './apartment-device.service';

describe('ApartmentDeviceService', () => {
  let service: ApartmentDeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApartmentDeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
