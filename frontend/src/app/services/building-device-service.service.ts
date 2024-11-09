import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponseService } from './api-response.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ResponseEntity } from '../models/response-entity';
import { BuildingDevice } from '../models/building_device';

@Injectable({
  providedIn: 'root'
})
export class BuildingDeviceServiceService {
  private apiUrl = `${environment.API_ENDPOINT}/api/buildingDevices`;
  
  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService,
    private auth : AuthService
  ) { }

  getBuildingDevice(deviceId: number): Observable<BuildingDevice> {
    return this.apiResponseService.extractBody(
      this.http.get<ResponseEntity<BuildingDevice>>(`${this.apiUrl}/${deviceId}`, {
        headers : this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  createBuildingDevice(device: Partial<BuildingDevice>): Observable<BuildingDevice> {
    return this.apiResponseService.extractBody(
      this.http.post<ResponseEntity<BuildingDevice>>(`${this.apiUrl}`, device, {
        headers : this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  removeBuildingDevice(deviceId: number): Observable<BuildingDevice> {
    return this.apiResponseService.extractBody(
      this.http.delete<ResponseEntity<BuildingDevice>>(`${this.apiUrl}/${deviceId}`, {
        headers : this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }
}