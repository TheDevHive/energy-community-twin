import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ResponseEntity } from '../models/response-entity';
import { ErrorService } from './error.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ApiError } from '../models/api-error';

@Injectable({
  providedIn: 'root'
})
export class ApiResponseService {
  constructor(private errorService: ErrorService) {}

  extractBody<T>(response: Observable<HttpResponse<ResponseEntity<T>>>): Observable<T> {
    return response.pipe(
      map(res => {
        const statusCode = res.status; // Extract status code directly from the HttpResponse
        const body = res.body;

        if (statusCode >= 200 && statusCode < 300) {
          if (body === null) {
            // Handle null body case, throw an error or return a default value
            throw new HttpErrorResponse({
              status: 204, // No Content
              error: {
                status: 204,
                error: 'Warning',
                message: 'Response body is null',
                timestamp: new Date().toISOString(),
                path: ''
              } as ApiError
            });
          }
          // Return the body of type T
          return body as T; // Cast the body to type T
        }

        // If status code is not in success range, throw error
        throw new HttpErrorResponse({
          status: statusCode,
          error: {
            status: statusCode,
            error: statusCode >= 400 ? 'Error' : 'Warning',
            message: `Unexpected status code: ${statusCode}`,
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
