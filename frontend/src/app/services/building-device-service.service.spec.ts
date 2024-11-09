import { TestBed } from '@angular/core/testing';

import { BuildingDeviceServiceService } from './building-device-service.service';

describe('BuildingDeviceServiceService', () => {
  let service: BuildingDeviceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildingDeviceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
