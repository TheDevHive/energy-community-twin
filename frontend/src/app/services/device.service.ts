import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { EnergyCurve } from '../models/energy_curve';
import { Measurement } from '../models/measurements';
import { TimeRange } from '../models/time_range';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = `${environment.API_ENDPOINT}/api/devices`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  saveEnergyPattern(deviceUuid: String, pattern: EnergyCurve): Observable<EnergyCurve> {
    return this.http.post<EnergyCurve>(
      `${this.apiUrl}/${deviceUuid}/energy-pattern`,
      pattern,
      { headers: this.authService.getHeaders() }
    );
  }

  getDevicePattern(deviceUuid: String): Observable<EnergyCurve> {
    return this.http.get<EnergyCurve>(
      `${this.apiUrl}/${deviceUuid}/energy-pattern`,
      { headers: this.authService.getHeaders() }
    );
  }

  updateEnergyPattern(deviceUuid: String, pattern: EnergyCurve): Observable<EnergyCurve> {
    return this.http.put<EnergyCurve>(
      `${this.apiUrl}/${deviceUuid}/energy-pattern`,
      pattern,
      { headers: this.authService.getHeaders() }
    );
  }

  deleteEnergyPattern(deviceUuid: String): Observable<null> {
    return this.http.delete<null>(
      `${this.apiUrl}/${deviceUuid}/energy-pattern`,
      { headers: this.authService.getHeaders() }
    );
  }

  getMeanEnergy(deviceUuid: String): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/${deviceUuid}/mean-energy`,
      { headers: this.authService.getHeaders() }
    );
  }

  /*
  getMeasurements(deviceUuid: String): Observable<Measurement[]> {
    return this.http.get<Measurement[]>(
      `${this.apiUrl}/${deviceUuid}/get-measurements`,
      { headers: this.authService.getHeaders() }
    );
  }
  */

  generateMeasurements(deviceUuid: String, timeRange: TimeRange): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.apiUrl}/${deviceUuid}/generate-measurements`,
      timeRange,
      { headers: this.authService.getHeaders() }
    );
  }
}

