import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { BuildingDeviceServiceService } from './building-device-service.service';

describe('BuildingDeviceServiceService', () => {
  let service: BuildingDeviceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule] // Add HttpClientTestingModule here
    });
    service = TestBed.inject(BuildingDeviceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
