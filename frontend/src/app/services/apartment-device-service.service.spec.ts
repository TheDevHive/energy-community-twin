import { TestBed } from '@angular/core/testing';

import { ApartmentDeviceServiceService } from './apartment-device-service.service';

describe('ApartmentDeviceServiceService', () => {
  let service: ApartmentDeviceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApartmentDeviceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
