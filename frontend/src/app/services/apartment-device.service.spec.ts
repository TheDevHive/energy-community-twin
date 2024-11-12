import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { ApartmentDeviceServiceService } from './apartment-device.service';

describe('ApartmentDeviceServiceService', () => {
  let service: ApartmentDeviceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]  // Add HttpClientModule here
    });
    service = TestBed.inject(ApartmentDeviceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});