import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Building } from '../models/building';
import { Apartment } from '../models/apartment';
import { ResponseEntity } from '../models/response-entity';
import { ApiResponseService } from './api-response.service';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  private apiUrl = 'http://localhost:8080/api/buildings';

  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService
  ) { }

  getBuilding(buildingId: number): Observable<Building> {
    return this.apiResponseService.extractBody(
      this.http.get<ResponseEntity<Building>>(`${this.apiUrl}/${buildingId}`)
    );
  }

  createBuilding(building: Partial<Building>): Observable<Building> {
    return this.apiResponseService.extractBody(
      this.http.post<ResponseEntity<Building>>(`${this.apiUrl}`, building)
    );
  }

  removeBuilding(buildingId: number): Observable<Building> {
    return this.apiResponseService.extractBody(
      this.http.delete<ResponseEntity<Building>>(`${this.apiUrl}/${buildingId}`)
    );
  }

  getApartments(buildingId: number): Observable<Apartment[]> {
    return this.apiResponseService.extractBody(
      this.http.get<ResponseEntity<Apartment[]>>(`${this.apiUrl}/${buildingId}/apartments`)
    );
  }

  addApartment(buildingId: number, apartmentId: number): Observable<Building> {
    return this.apiResponseService.extractBody(
      this.http.post<ResponseEntity<Building>>(
        `${this.apiUrl}/${buildingId}/apartments/${apartmentId}`,
        { apartmentId }
      )
    );
  }

  removeApartment(buildingId: number, apartmentId: number): Observable<Building> {
    return this.apiResponseService.extractBody(
      this.http.delete<ResponseEntity<Building>>(
        `${this.apiUrl}/${buildingId}/apartments/${apartmentId}`
      )
    );
  }
}