import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BuildingService } from './building.service';
import { Community } from '../models/community';
import { Building } from '../models/building';
import { Apartment } from '../models/apartment';
import { Admin } from '../models/admin';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

describe('BuildingService', () => {
  let service: BuildingService;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;
  const apiUrl = `${environment.API_ENDPOINT}/api/buildings`;

  const mockAdmin: Admin = {
    id: 1,
    email: 'admin@test.com'
  };

  const mockCommunity: Community = {
    id: 1,
    name: 'Test Community',
    admin: mockAdmin
  };

  const mockBuilding: Building = {
    id: 1,
    community: mockCommunity,
    address: '123 Test St',
    floors: 3
  };

  const mockUser: User = {
    id: 1,
    name: 'John',
    surname: 'Doe',
    birth_date: new Date(),
    phone: '1234567890',
    email: 'john@test.com'
  };

  const mockApartment: Apartment = {
    id: 1,
    building_id: mockBuilding.id,
    residents: 2,
    square_footage: 100,
    energy_class: 'A',
    user_id: mockUser.id
  };

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getHeaders']);
    authServiceSpy.getHeaders.and.returnValue({
      set: () => ({ 'Authorization': 'Bearer test-token' })
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
      service.getBuilding(1).subscribe(building => {
        expect(building).toEqual(mockBuilding);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBuilding);
    });
  });

  describe('createBuilding', () => {
    it('should create a new building', () => {
      const newBuilding = {
        community: mockCommunity,
        address: '123 New St',
        floors: 4
      };

      service.createBuilding(newBuilding).subscribe(building => {
        expect(building).toEqual(mockBuilding);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newBuilding);
      req.flush(mockBuilding);
    });
  });

  describe('removeBuilding', () => {
    it('should delete a building', () => {
      service.removeBuilding(1).subscribe(building => {
        expect(building).toEqual(mockBuilding);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockBuilding);
    });
  });

  describe('getApartments', () => {
    it('should get all apartments for a building', () => {
      const mockApartments: Apartment[] = [mockApartment];

      service.getApartments(1).subscribe(apartments => {
        expect(apartments).toEqual(mockApartments);
      });

      const req = httpMock.expectOne(`${apiUrl}/1/apartments`);
      expect(req.request.method).toBe('GET');
      req.flush(mockApartments);
    });
  });

  describe('addApartment', () => {
    it('should add an apartment to a building', () => {
      service.addApartment(1, 1).subscribe(building => {
        expect(building).toEqual(mockBuilding);
      });

      const req = httpMock.expectOne(`${apiUrl}/1/apartments/1`);
      expect(req.request.method).toBe('POST');
      req.flush(mockBuilding);
    });
  });

  describe('removeApartment', () => {
    it('should remove an apartment from a building', () => {
      service.removeApartment(1, 1).subscribe(building => {
        expect(building).toEqual(mockBuilding);
      });

      const req = httpMock.expectOne(`${apiUrl}/1/apartments/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockBuilding);
    });
  });
});