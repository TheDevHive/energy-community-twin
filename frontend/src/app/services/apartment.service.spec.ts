import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ApartmentService } from './apartment.service';

describe('ApartmentService', () => {
  let service: ApartmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule] // Import HttpClientTestingModule
    });
    service = TestBed.inject(ApartmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
