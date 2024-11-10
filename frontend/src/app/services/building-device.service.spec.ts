import { TestBed } from '@angular/core/testing';

import { BuildingDeviceService } from './building-device.service';

describe('BuildingDeviceService', () => {
  let service: BuildingDeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildingDeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
