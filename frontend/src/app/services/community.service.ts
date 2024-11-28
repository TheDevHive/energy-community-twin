import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Community } from '../models/community';
import { Building } from '../models/building';
import { ResponseEntity } from '../models/response-entity';
import { ApiResponseService } from './api-response.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

import { CommunityStats } from '../models/community';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private apiUrl = `${environment.API_ENDPOINT}/api/communities`;

  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService,
    private auth: AuthService
  ) { }

  getCommunities(): Observable<Community[]> {
    return this.apiResponseService.extractBody(
      this.http.get<ResponseEntity<Community[]>>(`${this.apiUrl}`, {
        headers: this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  getStats(): Observable<CommunityStats[]> {
    return this.apiResponseService.extractBody(
      this.http.get<ResponseEntity<CommunityStats[]>>(`${this.apiUrl}/stats`, {
        headers: this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  getCommunity(id: number): Observable<Community> {
    return this.apiResponseService.extractBody(
      this.http.get<ResponseEntity<Community>>(`${this.apiUrl}/${id}`, {
        headers: this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  updateCommunity(community: Community): Observable<Community> {
    return this.apiResponseService.extractBody(
      this.http.put<ResponseEntity<Community>>(`${this.apiUrl}/${community.id}`, community, {
        headers: this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  getCommunityStats(id: number): Observable<CommunityStats> {
    return this.apiResponseService.extractBody(
      this.http.get<ResponseEntity<CommunityStats>>(`${this.apiUrl}/stats/${id}`, {
        headers: this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  createCommunity(community: Partial<Community>): Observable<Community> {
    community.admin = { id: 1, email: 'admin@ciao.com' };
    return this.apiResponseService.extractBody(
      this.http.post<ResponseEntity<Community>>(`${this.apiUrl}`, community, {
        headers: this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  addBuilding(communityId: number, buildingId: number): Observable<Community> {
    return this.apiResponseService.extractBody(
      this.http.post<ResponseEntity<Community>>(
        `${this.apiUrl}/${communityId}/buildings/${buildingId}`,
        { buildingId }, {
        headers: this.auth.getHeaders(),
        observe: 'response'
      }
      )
    );
  }

  removeCommunity(id: number): Observable<Community> {
    return this.apiResponseService.extractBody(
      this.http.delete<ResponseEntity<Community>>(`${this.apiUrl}/${id}`, {
        headers: this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  removeBuilding(communityId: number, buildingId: number): Observable<Community> {
    return this.apiResponseService.extractBody(
      this.http.delete<ResponseEntity<Community>>(
        `${this.apiUrl}/${communityId}/buildings/${buildingId}`,
        {
          headers: this.auth.getHeaders(),
          observe: 'response'
        }
      )
    );
  }

  getBuildings(communityId: number): Observable<Building[]> {
    return this.apiResponseService.extractBody(
      this.http.get<ResponseEntity<Building[]>>(`${this.apiUrl}/${communityId}/buildings`, {
        headers: this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  generateMeasurements(community_id: String, dateStart: String, dateEnd:String): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.apiUrl}/${community_id}/generate-measurements`,
      {dateStart: dateStart, dateEnd: dateEnd}, // body: TODO: non so se funziona
      { headers: this.auth.getHeaders() }
    );
  }

}
