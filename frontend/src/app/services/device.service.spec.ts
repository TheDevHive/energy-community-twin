import { TestBed } from '@angular/core/testing';

import { DeviceService } from './device.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { EnergyCurve } from '../models/energy_curve';
import { HttpHeaders } from '@angular/common/http';


describe('DeviceService', () => {
  let service: DeviceService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getHeaders']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DeviceService,
        { provide: AuthService, useValue: spy }
      ]
    });

    service = TestBed.inject(DeviceService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    authServiceSpy.getHeaders.and.returnValue(
      new HttpHeaders().set('Authorization', 'Bearer token')
    );
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save energy pattern', () => {
    const deviceUuid = '123';
    const pattern: EnergyCurve = { energyCurve: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,13,14,15,16,17,18,19,20,21,22,23,24] };

    service.saveEnergyPattern(deviceUuid, pattern).subscribe(response => {
      expect(response).toEqual(pattern);
    });

    const req = httpMock.expectOne(`${environment.API_ENDPOINT}/api/devices/${deviceUuid}/energy-pattern`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token');
    req.flush(pattern);
  });

  it('should get device pattern', () => {
    const deviceUuid = '123';
    const pattern: EnergyCurve = { energyCurve: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,13,14,15,16,17,18,19,20,21,22,23,24] };

    service.getDevicePattern(deviceUuid).subscribe(response => {
      expect(response).toEqual(pattern);
    });

    const req = httpMock.expectOne(`${environment.API_ENDPOINT}/api/devices/${deviceUuid}/energy-pattern`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token');
    req.flush(pattern);
  });

  it('should update energy pattern', () => {
    const deviceUuid = '123';
    const pattern: EnergyCurve = { energyCurve: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,13,14,15,16,17,18,19,20,21,22,23,24] };

    service.updateEnergyPattern(deviceUuid, pattern).subscribe(response => {
      expect(response).toEqual(pattern);
    });

    const req = httpMock.expectOne(`${environment.API_ENDPOINT}/api/devices/${deviceUuid}/energy-pattern`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token');
    req.flush(pattern);
  });

  it('should delete energy pattern', () => {
    const deviceUuid = '123';
    service.deleteEnergyPattern(deviceUuid).subscribe(response => {
      expect(response).toBe(null); // Specifica il valore atteso
    });
  
    const req = httpMock.expectOne(`${environment.API_ENDPOINT}/api/devices/${deviceUuid}/energy-pattern`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token');
    req.flush(null);
  });

  it('should get mean energy', () => {
    const deviceUuid = '123';
    const meanEnergy = 100;

    service.getMeanEnergy(deviceUuid).subscribe(response => {
      expect(response).toBe(meanEnergy);
    });

    const req = httpMock.expectOne(`${environment.API_ENDPOINT}/api/devices/${deviceUuid}/mean-energy`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token');
    req.flush(meanEnergy);
  });

  it('should generate measurements', () => {
    const deviceUuid = '123';
    const result = true;

    service.generateMeasurements(deviceUuid, "01-01-2024", "31-12-2024").subscribe(response => {
      expect(response).toBe(result);
    });

    const req = httpMock.expectOne(`${environment.API_ENDPOINT}/api/devices/${deviceUuid}/generate-measurements`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token');
    req.flush(result);
  });
});
