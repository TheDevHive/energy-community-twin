import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Building } from '../models/building';
import { Apartment } from '../models/apartment';
import { ResponseEntity } from '../models/response-entity';
import { ApiResponseService } from './api-response.service';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { BuildingStats } from '../models/building';
import { BuildingDevice } from '../models/building_device';
import { TimeRange } from '../models/time_range';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  private apiUrl = `${environment.API_ENDPOINT}/api/buildings`;
  
  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService,
    private auth : AuthService
  ) { }

  getBuilding(buildingId: number): Observable<Building> {
    return this.apiResponseService.extractBody(
      this.http.get<ResponseEntity<Building>>(`${this.apiUrl}/${buildingId}`, {
        headers : this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  getStats(): Observable<BuildingStats[]> {
    return this.apiResponseService.extractBody(
      this.http.get<ResponseEntity<BuildingStats[]>>(`${this.apiUrl}/stats`, {
        headers : this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  createBuilding(building: Partial<Building>): Observable<Building> {
    return this.apiResponseService.extractBody(
      this.http.post<ResponseEntity<Building>>(`${this.apiUrl}`, building, {
        headers : this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  removeBuilding(buildingId: number): Observable<Building> {
    return this.apiResponseService.extractBody(
      this.http.delete<ResponseEntity<Building>>(`${this.apiUrl}/${buildingId}`, {
        headers : this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  getDevices(buildingId: number): Observable<BuildingDevice[]> {
    return this.apiResponseService.extractBody(
      this.http.get<ResponseEntity<BuildingDevice[]>>(`${this.apiUrl}/${buildingId}/devices`, {
        headers : this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  getApartments(buildingId: number): Observable<Apartment[]> {
    return this.apiResponseService.extractBody(
      this.http.get<ResponseEntity<Apartment[]>>(`${this.apiUrl}/${buildingId}/apartments`, {
        headers : this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  addApartment(buildingId: number, apartmentId: number): Observable<Building> {
    return this.apiResponseService.extractBody(
      this.http.post<ResponseEntity<Building>>(
        `${this.apiUrl}/${buildingId}/apartments/${apartmentId}`,
        { apartmentId }, {
          headers : this.auth.getHeaders(),
          observe: 'response'
        }
      )
    );
  }

  removeApartment(buildingId: number, apartmentId: number): Observable<Building> {
    return this.apiResponseService.extractBody(
      this.http.delete<ResponseEntity<Building>>(
        `${this.apiUrl}/${buildingId}/apartments/${apartmentId}`, {
          headers : this.auth.getHeaders(),
          observe: 'response'
        }
      )
    );
  }

  updateBuilding(building: Building): Observable<Building> {
    return this.apiResponseService.extractBody(
      this.http.put<ResponseEntity<Building>>(`${this.apiUrl}`, building, {
        headers: this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  generateMeasurements(building_id: String, timeRange: TimeRange): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.apiUrl}/${building_id}/generate-measurements`,
      timeRange,
      { headers: this.auth.getHeaders() }
    );
  }
}