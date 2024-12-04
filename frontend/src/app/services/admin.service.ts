import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponseService } from './api-response.service';
import { AuthService } from './auth.service';
import { Credentials } from '../models/credentials';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = `${environment.API_ENDPOINT}/admin`;

  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService,
    private auth: AuthService
  ) { }

  register(credentials: Credentials): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/register`, credentials, {
      observe: 'body'
    });
  }
}
