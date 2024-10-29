import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Community } from '../models/community';
import { Building } from '../models/building';
import { ResponseEntity } from '../models/response-entity';
import { ApiResponseService } from './api-response.service';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private apiUrl = 'http://localhost:8080/api/communities';

  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService
  ) {}

  getCommunities(): Observable<Community[]> {
    return this.apiResponseService.extractBody(
      this.http.get<ResponseEntity<Community[]>>(`${this.apiUrl}`)
    );
  }

  getCommunity(id: number): Observable<Community> {
    return this.apiResponseService.extractBody(
      this.http.get<ResponseEntity<Community>>(`${this.apiUrl}/${id}`)
    );
  }

  createCommunity(community: Partial<Community>): Observable<Community> {
    community.admin = { id: 1, email: 'admin@ciao.com' };
    return this.apiResponseService.extractBody(
      this.http.post<ResponseEntity<Community>>(`${this.apiUrl}`, community)
    );
  }

  addBuilding(communityId: number, buildingId: number): Observable<Community> {
    return this.apiResponseService.extractBody(
      this.http.post<ResponseEntity<Community>>(
        `${this.apiUrl}/${communityId}/buildings/${buildingId}`,
        { buildingId }
      )
    );
  }
  
  removeCommunity(id: number): Observable<Community> {
    return this.apiResponseService.extractBody(
      this.http.delete<ResponseEntity<Community>>(`${this.apiUrl}/${id}`)
    );
  }

  removeBuilding(communityId: number, buildingId: number): Observable<Community> {
    return this.apiResponseService.extractBody(
      this.http.delete<ResponseEntity<Community>>(
        `${this.apiUrl}/${communityId}/buildings/${buildingId}`
      )
    );
  }

  getBuildings(communityId: number): Observable<Building[]> {
    return this.apiResponseService.extractBody(
      this.http.get<ResponseEntity<Building[]>>(`${this.apiUrl}/${communityId}/buildings`)
    );
  }
}
