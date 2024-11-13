import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponseService } from './api-response.service';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { ApartmentDevice } from '../models/apartment_device';
import { ResponseEntity } from '../models/response-entity';

@Injectable({
  providedIn: 'root'
})
export class ApartmentDeviceServiceService {
  private apiUrl = `${environment.API_ENDPOINT}/api/apartmentDevices`;
  
  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService,
    private auth : AuthService
  ) { }

  getApartmentDevice(deviceId: number): Observable<ApartmentDevice> {
    return this.apiResponseService.extractBody(
      this.http.get<ResponseEntity<ApartmentDevice>>(`${this.apiUrl}/${deviceId}`, {
        headers : this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  createApartmentDevice(device: Partial<ApartmentDevice>): Observable<ApartmentDevice> {
    return this.apiResponseService.extractBody(
      this.http.post<ResponseEntity<ApartmentDevice>>(`${this.apiUrl}`, device, {
        headers : this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  removeApartmentDevice(deviceId: number): Observable<ApartmentDevice> {
    return this.apiResponseService.extractBody(
      this.http.delete<ResponseEntity<ApartmentDevice>>(`${this.apiUrl}/${deviceId}`, {
        headers : this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }

  updateApartmentDevice(device: ApartmentDevice): Observable<ApartmentDevice> {
    return this.apiResponseService.extractBody(
      this.http.put<ResponseEntity<ApartmentDevice>>(`${this.apiUrl}`, device, {
        headers: this.auth.getHeaders(),
        observe: 'response'
      })
    );
  }
}