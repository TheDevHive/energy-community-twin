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
    let errorMessage = 'Si è verificato un errore sconosciuto';
    let errorType = ErrorType.INTERNAL_SERVER_ERROR;

    if (error.error instanceof ErrorEvent) {
      errorMessage = 'Si è verificato un errore: ' + error.error.message;
    } else {
      const apiError = error.error as ApiError;
      
      switch (error.status) {
        case 400:
          errorType = ErrorType.VALIDATION_ERROR;
          errorMessage = apiError.message || 'Dati non validi';
          break;
        case 404:
          errorType = ErrorType.RESOURCE_NOT_FOUND;
          errorMessage = apiError.message || 'Risorsa non trovata';
          break;
        case 409:
          errorType = ErrorType.DUPLICATE_RESOURCE;
          errorMessage = apiError.message || 'Risorsa già esistente';
          break;
        case 401:
          errorType = ErrorType.UNAUTHORIZED;
          errorMessage = 'Non autorizzato';
          break;
        case 403:
          errorType = ErrorType.FORBIDDEN;
          errorMessage = 'Accesso negato';
          break;
        case 500:
          errorType = ErrorType.INTERNAL_SERVER_ERROR;
          errorMessage = 'Errore interno del server';
          break;
        default:
          errorMessage = apiError.message || 'Si è verificato un errore sconosciuto';
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