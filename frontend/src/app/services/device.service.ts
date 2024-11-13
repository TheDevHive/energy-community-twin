import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { EnergyCurve } from '../models/energy_curve';

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

  getDevicePatterns(deviceUuid: String): Observable<EnergyCurve> {
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

  deleteEnergyPattern(deviceUuid: String): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${deviceUuid}/energy-pattern`,
      { headers: this.authService.getHeaders() }
    );
  }
}

