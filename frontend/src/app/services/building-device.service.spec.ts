import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BuildingDeviceService } from './building-device.service';

describe('BuildingDeviceService', () => {
  let service: BuildingDeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule] // Import HttpClientTestingModule
    });
    service = TestBed.inject(BuildingDeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
