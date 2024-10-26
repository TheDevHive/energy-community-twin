import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Building } from '../models/building';
import { Apartment } from '../models/apartment';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  private apiUrl = 'api/communities';

  constructor(private http: HttpClient) { }

  getBuilding(buildingId: number): Observable<Building> {
    return this.http.get<Building>(`${this.apiUrl}/buildings/${buildingId}`);
  }

  createBuilding(building: Partial<Building>): Observable<Building> {
    return this.http.post<Building>(`${this.apiUrl}/buildings/create`, building);
  }

  removeBuilding(buildingId: number): Observable<Building> {
    return this.http.get<Building>(`${this.apiUrl}/buildings/${buildingId}/remove`);
  }
  getApartments(buildingId: number): Observable<Apartment[]> {
    return this.http.get<Apartment[]>(`${this.apiUrl}/buildings/${buildingId}/apartments`);
  }

  addApartment(buildingId: number, apartmentId: number): Observable<Building> {
    return this.http.post<Building>(`${this.apiUrl}/buildings/${buildingId}/apartments`, { apartmentId });
  }

  removeApartment(buildingId: number, apartmentId: number): Observable<Building> {
    return this.http.get<Building>(`${this.apiUrl}/buildings/${buildingId}/apartments/${apartmentId}/remove`);
  }

}
