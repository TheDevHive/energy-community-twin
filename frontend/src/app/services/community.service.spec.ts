import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommunityService } from './community.service';
import { Community } from '../models/community';
import { Building } from '../models/building';
import { ApiResponseService } from './api-response.service';
import { ResponseEntity } from '../models/response-entity';

describe('CommunityService', () => {
  let service: CommunityService;
  let httpMock: HttpTestingController;
  let apiResponseService: ApiResponseService;

  const mockCommunity: Community = {
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommunityService, ApiResponseService]
    });

    service = TestBed.inject(CommunityService);
    httpMock = TestBed.inject(HttpTestingController);
    apiResponseService = TestBed.inject(ApiResponseService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCommunities', () => {
    it('should retrieve all communities', () => {
      const mockCommunities: Community[] = [mockCommunity];
      const mockResponse: ResponseEntity<Community[]> = {
        body: mockCommunities,
        statusCode: 200,
        statusCodeValue: 200
      };

      service.getCommunities().subscribe(communities => {
        expect(communities).toEqual(mockCommunities);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/communities');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getCommunity', () => {
    it('should retrieve a specific community by id', () => {
      const mockResponse: ResponseEntity<Community> = {
        body: mockCommunity,
        statusCode: 200,
        statusCodeValue: 200
      };

      service.getCommunity(1).subscribe(community => {
        expect(community).toEqual(mockCommunity);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/communities/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('createCommunity', () => {
    it('should create a new community', () => {
      const newCommunity: Partial<Community> = {
        name: 'New Community'
      };

      const mockResponse: ResponseEntity<Community> = {
        body: { ...mockCommunity, name: 'New Community' },
        statusCode: 201,
        statusCodeValue: 201
      };

      service.createCommunity(newCommunity).subscribe(community => {
        expect(community.name).toBe('New Community');
        expect(community.admin).toBeTruthy();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/communities');
      expect(req.request.method).toBe('POST');
      expect(req.request.body.admin).toBeTruthy();
      req.flush(mockResponse);
    });
  });

  describe('addBuilding', () => {
    it('should add a building to a community', () => {
      const mockResponse: ResponseEntity<Community> = {
        body: mockCommunity,
        statusCode: 200,
        statusCodeValue: 200
      };

      service.addBuilding(1, 1).subscribe(community => {
        expect(community).toEqual(mockCommunity);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/communities/1/buildings/1');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('removeCommunity', () => {
    it('should remove a community', () => {
      const mockResponse: ResponseEntity<Community> = {
        body: mockCommunity,
        statusCode: 200,
        statusCodeValue: 200
      };

      service.removeCommunity(1).subscribe(community => {
        expect(community).toEqual(mockCommunity);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/communities/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('removeBuilding', () => {
    it('should remove a building from a community', () => {
      const mockResponse: ResponseEntity<Community> = {
        body: mockCommunity,
        statusCode: 200,
        statusCodeValue: 200
      };

      service.removeBuilding(1, 1).subscribe(community => {
        expect(community).toEqual(mockCommunity);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/communities/1/buildings/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('getBuildings', () => {
    it('should retrieve all buildings for a community', () => {
      const mockBuildings: Building[] = [mockBuilding];
      const mockResponse: ResponseEntity<Building[]> = {
        body: mockBuildings,
        statusCode: 200,
        statusCodeValue: 200
      };

      service.getBuildings(1).subscribe(buildings => {
        expect(buildings).toEqual(mockBuildings);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/communities/1/buildings');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});