import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BuildingService } from './building.service';
import { Building } from '../models/building';
import { Apartment } from '../models/apartment';
import { ApiResponseService } from './api-response.service';
import { ResponseEntity } from '../models/response-entity';

describe('BuildingService', () => {
  let service: BuildingService;
  let httpMock: HttpTestingController;
  let apiResponseService: ApiResponseService;

  const mockCommunity = {
    id: 1,
    name: 'Test Community',
    admin: { id: 1, email: 'admin@test.com' }
  };

  const mockBuilding: Building = {
    id: 1,
    community: mockCommunity,
    address: 'Test Address',
    floors: 5
  };

  const mockApartment: Apartment = {
    id: 1,
    residents: 2,
    square_footage: 100,
    energy_class: 'A',
    building_id: 1,
    user_id: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BuildingService, ApiResponseService]
    });

    service = TestBed.inject(BuildingService);
    httpMock = TestBed.inject(HttpTestingController);
    apiResponseService = TestBed.inject(ApiResponseService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBuilding', () => {
    it('should retrieve a specific building by id', () => {
      const mockResponse: ResponseEntity<Building> = {
        body: mockBuilding,
        statusCode: 200,
        statusCodeValue: 200
      };

      service.getBuilding(1).subscribe(building => {
        expect(building).toEqual(mockBuilding);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/buildings/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('createBuilding', () => {
    it('should create a new building', () => {
      const newBuilding: Partial<Building> = {
        address: 'New Address',
        floors: 3,
        community: mockCommunity
      };

      const mockResponse: ResponseEntity<Building> = {
        body: { ...mockBuilding, ...newBuilding },
        statusCode: 201,
        statusCodeValue: 201
      };

      service.createBuilding(newBuilding).subscribe(building => {
        expect(building.address).toBe('New Address');
        expect(building.floors).toBe(3);
        expect(building.community).toEqual(mockCommunity);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/buildings');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('removeBuilding', () => {
    it('should remove a building', () => {
      const mockResponse: ResponseEntity<Building> = {
        body: mockBuilding,
        statusCode: 200,
        statusCodeValue: 200
      };

      service.removeBuilding(1).subscribe(building => {
        expect(building).toEqual(mockBuilding);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/buildings/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('getApartments', () => {
    it('should retrieve all apartments for a building', () => {
      const mockApartments: Apartment[] = [mockApartment];
      const mockResponse: ResponseEntity<Apartment[]> = {
        body: mockApartments,
        statusCode: 200,
        statusCodeValue: 200
      };

      service.getApartments(1).subscribe(apartments => {
        expect(apartments).toEqual(mockApartments);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/buildings/1/apartments');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('addApartment', () => {
    it('should add an apartment to a building', () => {
      const mockResponse: ResponseEntity<Building> = {
        body: mockBuilding,
        statusCode: 200,
        statusCodeValue: 200
      };

      service.addApartment(1, 1).subscribe(building => {
        expect(building).toEqual(mockBuilding);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/buildings/1/apartments/1');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('removeApartment', () => {
    it('should remove an apartment from a building', () => {
      const mockResponse: ResponseEntity<Building> = {
        body: mockBuilding,
        statusCode: 200,
        statusCodeValue: 200
      };

      service.removeApartment(1, 1).subscribe(building => {
        expect(building).toEqual(mockBuilding);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/buildings/1/apartments/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });
});