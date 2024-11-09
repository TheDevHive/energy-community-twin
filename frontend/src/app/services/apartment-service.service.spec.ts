import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { ApartmentServiceService } from './apartment-service.service';

describe('ApartmentServiceService', () => {
  let service: ApartmentServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule] // Add HttpClientTestingModule here
    });
    service = TestBed.inject(ApartmentServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
