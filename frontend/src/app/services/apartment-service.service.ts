import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponseService } from './api-response.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { Apartment } from '../models/apartment';
import { Observable } from 'rxjs';
import { ResponseEntity } from '../models/response-entity';
import { ApartmentDevice } from '../models/apartment_device';

@Injectable({
  providedIn: 'root'
})
export class ApartmentServiceService {
  private apiUrl = `${environment.API_ENDPOINT}/api/apartments`;
  
  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService,
    private auth : AuthService
  ) { }

  getApartment(apartmentId: number): Observable<Apartment> {
    return this.apiResponseService.extractBody(
      this.http.get<ResponseEntity<Apartment>>(`${this.apiUrl}/${apartmentId}`, {
        headers : this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  createApartment(apartment: Partial<Apartment>): Observable<Apartment> {
    return this.apiResponseService.extractBody(
      this.http.post<ResponseEntity<Apartment>>(`${this.apiUrl}`, apartment, {
        headers : this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  removeApartment(apartmentId: number): Observable<Apartment> {
    return this.apiResponseService.extractBody(
      this.http.delete<ResponseEntity<Apartment>>(`${this.apiUrl}/${apartmentId}`, {
        headers : this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  getDevices(apartmentId: number): Observable<ApartmentDevice[]> {
    return this.apiResponseService.extractBody(
      this.http.get<ResponseEntity<ApartmentDevice[]>>(`${this.apiUrl}/${apartmentId}/devices`, {
        headers : this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  addDevice(apartmentId: number, deviceId: number): Observable<Apartment> {
    return this.apiResponseService.extractBody(
      this.http.post<ResponseEntity<Apartment>>(
        `${this.apiUrl}/${apartmentId}/devices/${deviceId}`,
        { apartmentId }, {
          headers : this.auth.getHeaders(),
          observe: 'response'
        }
      )
    );
  }

  removeDevice(apartmentId: number, deviceId: number): Observable<Apartment> {
    return this.apiResponseService.extractBody(
      this.http.delete<ResponseEntity<Apartment>>(
        `${this.apiUrl}/${apartmentId}/devices/${deviceId}`, {
          headers : this.auth.getHeaders(),
          observe: 'response'
        }
      )
    );
  }
}