import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommunityService } from './community.service';
import { Community } from '../models/community';
import { Building } from '../models/building';
import { Admin } from '../models/admin';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

describe('CommunityService', () => {
  let service: CommunityService;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;
  const apiUrl = `${environment.API_ENDPOINT}/api/communities`;

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

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getHeaders']);
    authServiceSpy.getHeaders.and.returnValue({
      set: () => ({ 'Authorization': 'Bearer test-token' })
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CommunityService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(CommunityService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCommunities', () => {
    it('should return communities', () => {
      const mockCommunities: Community[] = [mockCommunity];

      service.getCommunities().subscribe(communities => {
        expect(communities).toEqual(mockCommunities);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockCommunities);
    });
  });

  describe('getCommunity', () => {
    it('should return a single community', () => {
      service.getCommunity(1).subscribe(community => {
        expect(community).toEqual(mockCommunity);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCommunity);
    });
  });

  describe('createCommunity', () => {
    it('should create a new community', () => {
      const newCommunity = { name: 'New Community' };

      service.createCommunity(newCommunity).subscribe(community => {
        expect(community).toEqual(mockCommunity);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newCommunity);
      req.flush(mockCommunity);
    });
  });

  describe('addBuilding', () => {
    it('should add a building to a community', () => {
      service.addBuilding(1, 1).subscribe(community => {
        expect(community).toEqual(mockCommunity);
      });

      const req = httpMock.expectOne(`${apiUrl}/1/buildings/1`);
      expect(req.request.method).toBe('POST');
      req.flush(mockCommunity);
    });
  });

  describe('removeCommunity', () => {
    it('should delete a community', () => {
      service.removeCommunity(1).subscribe(community => {
        expect(community).toEqual(mockCommunity);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockCommunity);
    });
  });

  describe('removeBuilding', () => {
    it('should remove a building from a community', () => {
      service.removeBuilding(1, 1).subscribe(community => {
        expect(community).toEqual(mockCommunity);
      });

      const req = httpMock.expectOne(`${apiUrl}/1/buildings/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockCommunity);
    });
  });

  describe('getBuildings', () => {
    it('should get all buildings for a community', () => {
      const mockBuildings: Building[] = [mockBuilding];

      service.getBuildings(1).subscribe(buildings => {
        expect(buildings).toEqual(mockBuildings);
      });

      const req = httpMock.expectOne(`${apiUrl}/1/buildings`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBuildings);
    });
  });
});
