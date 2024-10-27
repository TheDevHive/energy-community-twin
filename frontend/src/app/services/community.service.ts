import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Community } from '../models/community';
import { Building } from '../models/building';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private apiUrl = 'http://localhost:8080/api/communities'; // Base URL to REST API

  constructor(private http: HttpClient) {}

  getCommunities(): Observable<Community[]> {
    return this.http.get<Community[]>(`${this.apiUrl}`);
  }

  getCommunity(id: number): Observable<Community> {
    return this.http.get<Community>(`${this.apiUrl}/${id}`);
  }

  createCommunity(community: Partial<Community>): Observable<Community> {
    community.admin = { id: 1, email: 'admin@ciao.com' };
    return this.http.post<Community>(`${this.apiUrl}`, community);
  }

  addBuilding(communityId: number, buildingId: number): Observable<Community> {
    return this.http.post<Community>(`${this.apiUrl}/${communityId}/buildings/${buildingId}`, { buildingId });
  }
  
  removeCommunity(id: number): Observable<Community> {
    return this.http.delete<Community>(`${this.apiUrl}/${id}`);
  }
  removeBuilding(communityId: number, buildingId: number): Observable<Community> {
    return this.http.delete<Community>(`${this.apiUrl}/${communityId}/buildings/${buildingId}`);
  }
  getBuildings(communityId: number): Observable<Building[]> {
    return this.http.get<Building[]>(`${this.apiUrl}/${communityId}/buildings`);
  }
}
