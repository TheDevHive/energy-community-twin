import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';

import { EnergyReportService } from './energy-report.service';
import { CommunityService } from './community.service';
import { BuildingService } from './building.service';
import { ApartmentService } from './apartment.service';
import { DeviceService } from './device.service';
import { AuthService } from './auth.service';
import { EnergyReport } from '../models/energy-report';

describe('EnergyReportService', () => {
  let service: EnergyReportService;
  let httpMock: HttpTestingController;
  let communityServiceSpy: jasmine.SpyObj<CommunityService>;
  let buildingServiceSpy: jasmine.SpyObj<BuildingService>;
  let apartmentServiceSpy: jasmine.SpyObj<ApartmentService>;
  let deviceServiceSpy: jasmine.SpyObj<DeviceService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const communitySpy = jasmine.createSpyObj('CommunityService', ['generateMeasurements']);
    const buildingSpy = jasmine.createSpyObj('BuildingService', ['generateMeasurements']);
    const apartmentSpy = jasmine.createSpyObj('ApartmentService', ['generateMeasurements']);
    const deviceSpy = jasmine.createSpyObj('DeviceService', ['generateMeasurements']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getHeaders']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EnergyReportService,
        { provide: CommunityService, useValue: communitySpy },
        { provide: BuildingService, useValue: buildingSpy },
        { provide: ApartmentService, useValue: apartmentSpy },
        { provide: DeviceService, useValue: deviceSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    });

    service = TestBed.inject(EnergyReportService);
    httpMock = TestBed.inject(HttpTestingController);
    communityServiceSpy = TestBed.inject(CommunityService) as jasmine.SpyObj<CommunityService>;
    buildingServiceSpy = TestBed.inject(BuildingService) as jasmine.SpyObj<BuildingService>;
    apartmentServiceSpy = TestBed.inject(ApartmentService) as jasmine.SpyObj<ApartmentService>;
    deviceServiceSpy = TestBed.inject(DeviceService) as jasmine.SpyObj<DeviceService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateReport', () => {
    const timeRange = { start: '2021-01-01', end: '2021-01-31' };

    it('should return empty Observable if refUUID is undefined', (done) => {
      service.generateReport(undefined, timeRange).subscribe({
        next: (value) => {
          expect(value).toBeUndefined();
          done();
        }
      });
    });

    it('should call apartmentService.generateMeasurements when refUUID starts with A', () => {
      apartmentServiceSpy.generateMeasurements.and.returnValue(of(true));
      service.generateReport('A123', timeRange);
      expect(apartmentServiceSpy.generateMeasurements).toHaveBeenCalledWith('123', timeRange);
    });

    it('should call buildingService.generateMeasurements when refUUID starts with B', () => {
      buildingServiceSpy.generateMeasurements.and.returnValue(of(true));
      service.generateReport('B456', timeRange);
      expect(buildingServiceSpy.generateMeasurements).toHaveBeenCalledWith('456', timeRange);
    });

    it('should call communityService.generateMeasurements when refUUID starts with C', () => {
      communityServiceSpy.generateMeasurements.and.returnValue(of(true));
      service.generateReport('C789', timeRange);
      expect(communityServiceSpy.generateMeasurements).toHaveBeenCalledWith('789', timeRange);
    });

    it('should call deviceService.generateMeasurements when refUUID starts with D', () => {
      deviceServiceSpy.generateMeasurements.and.returnValue(of(true));
      service.generateReport('D012', timeRange);
      expect(deviceServiceSpy.generateMeasurements).toHaveBeenCalledWith('012', timeRange);
    });

    it('should return empty Observable for unknown refUUID prefix', (done) => {
      service.generateReport('E999', timeRange).subscribe({
        next: (value) => {
          expect(value).toBeUndefined();
          done();
        }
      });
    });
  });

  describe('deleteReport', () => {
    it('should call http.delete with correct URL', () => {
      const mockHeaders = new HttpHeaders();
      authServiceSpy.getHeaders.and.returnValue(mockHeaders);

      service.deleteReport('report123').subscribe();

      const req = httpMock.expectOne(`${service['apiUrl']}/report123`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers).toBe(mockHeaders);
      req.flush({});
    });
  });

  describe('getReports', () => {
    it('should call http.get with correct URL and headers', () => {
      const mockHeaders = new HttpHeaders();
      const mockReports: EnergyReport[] = [];
      authServiceSpy.getHeaders.and.returnValue(mockHeaders);

      service.getReports('ref123').subscribe(reports => {
        expect(reports).toEqual(mockReports);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/refUUID/ref123`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers).toBe(mockHeaders);
      req.flush(mockReports);
    });
  });
});