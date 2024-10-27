import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Building } from '../models/building';
import { Apartment } from '../models/apartment';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  private apiUrl = 'http://localhost:8080/api/buildings';

  constructor(private http: HttpClient) { }

  getBuilding(buildingId: number): Observable<Building> {
    return this.http.get<Building>(`${this.apiUrl}/${buildingId}`);
  }

  createBuilding(building: Partial<Building>): Observable<Building> {
    return this.http.post<Building>(`${this.apiUrl}`, building);
  }

  removeBuilding(buildingId: number): Observable<Building> {
    return this.http.delete<Building>(`${this.apiUrl}/${buildingId}`);
  }
  getApartments(buildingId: number): Observable<Apartment[]> {
    return this.http.get<Apartment[]>(`${this.apiUrl}/${buildingId}/apartments`);
  }

  addApartment(buildingId: number, apartmentId: number): Observable<Building> {
    return this.http.post<Building>(`${this.apiUrl}/${buildingId}/apartments/${apartmentId}`, { apartmentId });
  }

  removeApartment(buildingId: number, apartmentId: number): Observable<Building> {
    return this.http.delete<Building>(`${this.apiUrl}/${buildingId}/apartments/${apartmentId}`);
  }
}
