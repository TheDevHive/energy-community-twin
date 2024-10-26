import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Community } from '../models/community';
import { Building } from '../models/building';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private apiUrl = 'api/communities'; // Base URL to REST API

  constructor(private http: HttpClient) {}

  getCommunities(): Observable<Community[]> {
    return this.http.get<Community[]>(this.apiUrl);
  }

  getCommunity(id: number): Observable<Community> {
    return this.http.get<Community>(`${this.apiUrl}/${id}`);
  }

  createCommunity(community: Partial<Community>): Observable<Community> {
    return this.http.post<Community>(this.apiUrl, community);
  }

  addBuilding(communityId: number, buildingId: number): Observable<Community> {
    return this.http.post<Community>(`${this.apiUrl}/${communityId}/buildings`, { buildingId });
  }

  getBuildings(communityId: number): Observable<Building[]> {
    return this.http.get<Building[]>(`${this.apiUrl}/${communityId}/buildings`);
  }

  getBuilding(communityId: number, buildingId: number): Observable<Building> {
    return this.http.get<Building>(`${this.apiUrl}/${communityId}/buildings/${buildingId}`);
  }

  createBuilding(communityId: number, building: Partial<Building>): Observable<Building> {
    return this.http.post<Building>(`${this.apiUrl}/${communityId}/buildings`, building);
  }
}
