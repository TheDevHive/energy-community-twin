import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { Credentials } from '../models/credentials';
import { AuthToken } from '../models/auth_token';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;

  private token?: string;
  private role?: string;


  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<boolean> {
    const creds: Credentials = { email, password };
    
    return this.http.post<AuthToken>(`${environment.API_ENDPOINT}/login`, creds)
      .pipe(
        map((authToken: AuthToken) => {
          this.token = authToken.token;
          this.role = authToken.role;
          this.isLoggedIn = true;
          return true;
        }),
        // catch 3 types of errors (unauthorized(401), not-found(404) and generic server error)
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            return of(false);
          }
          if (error.status === 404) {
            return of(false);
          }
          return throwError(error);
        })
      );
  }

  logout() {
    this.isLoggedIn = false;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
