import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private loginUrl = 'api/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<boolean> {
    // Simulate an API call
    if (email === 'test@example.com' && password === 'password123') {
      this.isLoggedIn = true;
      return of(true); // Simulate a successful login
    } else {
      return of(false); // Simulate a failed login
    }
  }

  logout() {
    this.isLoggedIn = false;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
