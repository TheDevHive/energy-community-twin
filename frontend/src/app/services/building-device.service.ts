import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BuildingDevice } from '../models/building_device';
import { ResponseEntity } from '../models/response-entity';
import { ApiResponseService } from './api-response.service';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BuildingDeviceService {
  private apiUrl = `${environment.API_ENDPOINT}/api/buildingDevices`;

  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService,
    private auth: AuthService
  ) { }

  getDevice(deviceId: number): Observable<BuildingDevice> {
    return this.apiResponseService.extractBody(
      this.http.get<ResponseEntity<BuildingDevice>>(`${this.apiUrl}/${deviceId}`, {
        headers: this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  getDevices(): Observable<BuildingDevice[]> {
    return this.apiResponseService.extractBody(
      this.http.get<ResponseEntity<BuildingDevice[]>>(`${this.apiUrl}`, {
        headers: this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  createDevice(device: Partial<BuildingDevice>): Observable<BuildingDevice> {
    return this.apiResponseService.extractBody(
      this.http.post<ResponseEntity<BuildingDevice>>(`${this.apiUrl}`, device, {
        headers: this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  updateDevice(device: BuildingDevice): Observable<BuildingDevice> {
    return this.apiResponseService.extractBody(
      this.http.put<ResponseEntity<BuildingDevice>>(`${this.apiUrl}`, device, {
        headers: this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  removeDevice(deviceId: number): Observable<BuildingDevice> {
    return this.apiResponseService.extractBody(
      this.http.delete<ResponseEntity<BuildingDevice>>(`${this.apiUrl}/${deviceId}`, {
        headers: this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }
}
