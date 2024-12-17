import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BuildingService } from './building.service';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { BUILDINGS } from '../MOCKS/BUILDINGS';
import { COMMUNITIES } from '../MOCKS/COMMUNITIES';
import { Apartment } from '../models/apartment';

describe('BuildingService', () => {
  let service: BuildingService;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;
  const apiUrl = `${environment.API_ENDPOINT}/api/buildings`;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getHeaders']);
    authServiceSpy.getHeaders.and.returnValue({
      'Authorization': 'Bearer test-token'
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BuildingService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(BuildingService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBuilding', () => {
    it('should return a building by id', () => {
      const buildingId = BUILDINGS[0].id;

      service.getBuilding(buildingId).subscribe(building => {
        expect(building).toEqual(BUILDINGS[0]);
      });

      const req = httpMock.expectOne(`${apiUrl}/${buildingId}`);
      expect(req.request.method).toBe('GET');
      req.flush(BUILDINGS[0]);
    });
  });

  describe('createBuilding', () => {
    it('should create a new building', () => {
      const newBuilding = {
        community: COMMUNITIES[0],
        address: '123 New St',
        floors: 4,
        stats: BUILDINGS[0].stats
      };

      service.createBuilding(newBuilding).subscribe(building => {
        expect(building).toEqual(BUILDINGS[0]);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newBuilding);
      req.flush(BUILDINGS[0]);
    });
  });

  describe('removeBuilding', () => {
    it('should delete a building', () => {
      const buildingId = BUILDINGS[0].id;

      service.removeBuilding(buildingId).subscribe(building => {
        expect(building).toEqual(BUILDINGS[0]);
      });

      const req = httpMock.expectOne(`${apiUrl}/${buildingId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(BUILDINGS[0]);
    });
  });

  describe('getApartments', () => {
    it('should get all apartments for a building', () => {
      const building = BUILDINGS[0];

      // Define mock apartments
      const mockApartments: Apartment[] = [
        { id: 1, building: building, residents: 2, squareFootage: 100, energyCost: 0.20, userId: 1, stats: { apartmentId: 1, energyProduction: 10, energyConsumption: 5, energyClass: 'A' } },
        { id: 2, building: building, residents: 3, squareFootage: 150, energyCost: 0.25, userId: 2, stats: { apartmentId: 2, energyProduction: 15, energyConsumption: 7, energyClass: 'B' } }
      ];

      service.getApartments(building.id).subscribe(apartments => {
        expect(apartments).toEqual(mockApartments);
      });

      const req = httpMock.expectOne(`${apiUrl}/${building.id}/apartments`);
      expect(req.request.method).toBe('GET');
      req.flush(mockApartments);
    });
  });


  describe('addApartment', () => {
    it('should add an apartment to a building', () => {
      const buildingId = BUILDINGS[0].id;
      const apartmentId = 1;

      service.addApartment(buildingId, apartmentId).subscribe(building => {
        expect(building).toEqual(BUILDINGS[0]);
      });

      const req = httpMock.expectOne(`${apiUrl}/${buildingId}/apartments/${apartmentId}`);
      expect(req.request.method).toBe('POST');
      req.flush(BUILDINGS[0]);
    });
  });

  describe('removeApartment', () => {
    it('should remove an apartment from a building', () => {
      const buildingId = BUILDINGS[0].id;
      const apartmentId = 1;

      service.removeApartment(buildingId, apartmentId).subscribe(building => {
        expect(building).toEqual(BUILDINGS[0]);
      });

      const req = httpMock.expectOne(`${apiUrl}/${buildingId}/apartments/${apartmentId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(BUILDINGS[0]);
    });
  });
});
