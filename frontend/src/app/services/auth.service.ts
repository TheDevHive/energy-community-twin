import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { Credentials } from '../models/credentials';
import { AuthToken } from '../models/auth_token';

import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token?: string;
  private role?: string;

  private headers = new HttpHeaders().set('Authorization', `Basic ${this.getToken()}`);


  constructor(private http: HttpClient) {
    // Restore token and logged-in status from localStorage
    const savedToken = localStorage.getItem('authToken');
    const savedRole = localStorage.getItem('authRole');
    if (savedToken) {
      this.token = savedToken;
      this.role = savedRole || '';
    }
  }

  login(email: string, password: string): Observable<boolean> {
    const creds: Credentials = { email, password };
    
    return this.http.post<AuthToken>(`${environment.API_ENDPOINT}/login`, creds)
      .pipe(
        map((authToken: AuthToken) => {
          this.token = authToken.token;
          this.role = authToken.role;
          // Save token and role to localStorage
          localStorage.setItem('authToken', authToken.token);
          localStorage.setItem('authRole', authToken.role);
          return true;
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 || error.status === 404) {
            return of(false);
          }
          return throwError(error);
        })
      );
  }

  logout() {
    this.token = undefined;
    this.role = undefined;
    localStorage.removeItem('authToken');
    localStorage.removeItem('authRole');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getHeaders(): HttpHeaders {
    return this.headers;
  }

  private getToken(){
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      return savedToken;
    }
    return '';
  }
}
