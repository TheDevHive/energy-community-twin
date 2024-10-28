import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ResponseEntity } from '../models/response-entity';
import { ErrorService } from './error.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../models/api-error';

@Injectable({
  providedIn: 'root'
})
export class ApiResponseService {
  constructor(private errorService: ErrorService) {}

  extractBody<T>(response: Observable<ResponseEntity<T>>): Observable<T> {
    return response.pipe(
      map(res => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          return res.body;
        }
        // If status code is not in success range, throw error
        throw new HttpErrorResponse({ 
          status: res.statusCode,
          error: {
            status: res.statusCode,
            error: res.statusCodeValue >= 400 ? 'Error' : 'Warning',
            message: `Unexpected status code: ${res.statusCode}`,
            timestamp: new Date().toISOString(),
            path: ''
          } as ApiError
        });
      }),
      catchError((error: HttpErrorResponse) => {
        // Pass the error to the error service for handling
        return this.errorService.handleError(error);
      })
    );
  }
}