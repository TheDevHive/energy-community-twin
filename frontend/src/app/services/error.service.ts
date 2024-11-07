import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ApiError, ErrorType } from '../models/api-error';
import { ErrorModalService } from './error-modal.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor(private errorModalService: ErrorModalService) {}
  
  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    let errorType = ErrorType.INTERNAL_SERVER_ERROR;

    if (error.error instanceof ErrorEvent) {
      errorMessage = 'An error occurred: ' + error.error.message;
    } else {
      const apiError = error.error as ApiError;
      
      switch (error.status) {
        case 400:
          errorType = ErrorType.VALIDATION_ERROR;
          errorMessage = apiError.message || 'Invalid data';
          break;
        case 404:
          errorType = ErrorType.RESOURCE_NOT_FOUND;
          errorMessage = apiError.message || 'Resource not found';
          break;
        case 409:
          errorType = ErrorType.DUPLICATE_RESOURCE;
          errorMessage = apiError.message || 'Resource already exists';
          break;
        case 401:
          errorType = ErrorType.UNAUTHORIZED;
          errorMessage = 'Unauthorized';
          break;
        case 403:
          errorType = ErrorType.FORBIDDEN;
          errorMessage = 'Access denied';
          break;
        case 500:
          errorType = ErrorType.INTERNAL_SERVER_ERROR;
          errorMessage = 'Internal server error';
          break;
        default:
          errorMessage = apiError.message || 'An unknown error occurred';
      }
    }

    // Show the error modal
    this.errorModalService.showError(errorType, errorMessage);

    // Still return the error for components to handle if needed
    return throwError(() => ({
      type: errorType,
      message: errorMessage
    }));
  }
}
