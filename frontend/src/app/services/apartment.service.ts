import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Apartment } from '../models/apartment';
import { ResponseEntity } from '../models/response-entity';
import { ApiResponseService } from './api-response.service';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

import { ApartmentStats } from '../models/apartment';
import { ApartmentDevice } from '../models/apartment_device';

@Injectable({
  providedIn: 'root'
})
export class ApartmentService {
  private apiUrl = `${environment.API_ENDPOINT}/api/apartments`;

  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService,
    private auth: AuthService
  ) { }

  getApartment(apartmentId: number): Observable<Apartment> {
    return this.apiResponseService.extractBody(
      this.http.get<ResponseEntity<Apartment>>(`${this.apiUrl}/${apartmentId}`, {
        headers: this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  createApartment(apartment: Partial<Apartment>): Observable<Apartment> {
    return this.apiResponseService.extractBody(
      this.http.post<ResponseEntity<Apartment>>(`${this.apiUrl}`, apartment, {
        headers: this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  updateApartment(apartment: Apartment): Observable<Apartment> {
    return this.apiResponseService.extractBody(
      this.http.put<ResponseEntity<Apartment>>(`${this.apiUrl}`, apartment, {
        headers: this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  deleteApartment(apartmentId: number): Observable<Apartment> {
    return this.apiResponseService.extractBody(
      this.http.delete<ResponseEntity<Apartment>>(`${this.apiUrl}/${apartmentId}`, {
        headers: this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  getApartmentDevices(apartmentId: number): Observable<ApartmentDevice[]> {
    return this.apiResponseService.extractBody(
      this.http.get<ResponseEntity<ApartmentDevice[]>>(`${this.apiUrl}/${apartmentId}/devices`, {
        headers: this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  getStats(): Observable<ApartmentStats[]> {
    return this.apiResponseService.extractBody(
      this.http.get<ResponseEntity<ApartmentStats[]>>(`${this.apiUrl}/stats`, {
        headers: this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }
}
