import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { ApartmentDeviceService } from './apartment-device.service';

describe('ApartmentDeviceService', () => {
  let service: ApartmentDeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]  // Add HttpClientModule here
    });
    service = TestBed.inject(ApartmentDeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
