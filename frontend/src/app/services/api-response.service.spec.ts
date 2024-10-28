import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ApiResponseService } from './api-response.service';
import { ErrorService } from './error.service';
import { ResponseEntity } from '../models/response-entity';
import { ApiError, ErrorType } from '../models/api-error';

describe('ApiResponseService', () => {
  let service: ApiResponseService;
  let errorService: jasmine.SpyObj<ErrorService>;

  // Mock response data
  const mockSuccessResponse: ResponseEntity<string> = {
    body: 'Success',
    statusCode: 200,
    statusCodeValue: 200
  };

  beforeEach(() => {
    // Create spy for ErrorService
    const errorServiceSpy = jasmine.createSpyObj('ErrorService', ['handleError']);
    errorServiceSpy.handleError.and.callFake((error: HttpErrorResponse) => {
      return throwError(() => error.error);
    });

    TestBed.configureTestingModule({
      providers: [
        ApiResponseService,
        { provide: ErrorService, useValue: errorServiceSpy }
      ]
    });

    service = TestBed.inject(ApiResponseService);
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
  });

  // ... other tests ...

  describe('Error Handling', () => {
    it('should propagate server validation errors', (done) => {
      // Create validation error response
      const validationError: ApiError = {
        timestamp: new Date().toISOString(),
        status: 400,
        error: ErrorType.VALIDATION_ERROR,
        message: 'Invalid input',
        path: '/api/test'
      };

      // Create HTTP error response
      const errorResponse = new HttpErrorResponse({
        error: validationError,
        status: 400,
        statusText: 'Bad Request'
      });

      // Setup error service spy to return the validation error
      errorService.handleError.and.returnValue(throwError(() => validationError));

      // Create observable that will emit error
      const response$ = throwError(() => errorResponse);

      // Test the service
      service.extractBody(response$).subscribe({
        next: () => {
          done.fail('Should have been an error');
        },
        error: (error: ApiError) => {
          expect(errorService.handleError).toHaveBeenCalledWith(errorResponse);
          expect(error).toEqual(validationError);
          expect(error.error).toBe(ErrorType.VALIDATION_ERROR);
          expect(error.message).toBe('Invalid input');
          expect(error.status).toBe(400);
          done();
        }
      });
    });

    it('should handle non-ApiError validation errors', (done) => {
      // Create a generic validation error
      const genericError = {
        status: 400,
        message: 'Validation failed'
      };

      const errorResponse = new HttpErrorResponse({
        error: genericError,
        status: 400,
        statusText: 'Bad Request'
      });

      errorService.handleError.and.returnValue(throwError(() => genericError));

      const response$ = throwError(() => errorResponse);

      service.extractBody(response$).subscribe({
        next: () => {
          done.fail('Should have been an error');
        },
        error: (error) => {
          expect(errorService.handleError).toHaveBeenCalledWith(errorResponse);
          expect(error).toEqual(genericError);
          done();
        }
      });
    });

    it('should handle malformed validation errors', (done) => {
      const malformedError = 'Invalid input';
      const errorResponse = new HttpErrorResponse({
        error: malformedError,
        status: 400,
        statusText: 'Bad Request'
      });

      errorService.handleError.and.returnValue(throwError(() => malformedError));

      const response$ = throwError(() => errorResponse);

      service.extractBody(response$).subscribe({
        next: () => {
          done.fail('Should have been an error');
        },
        error: (error) => {
          expect(errorService.handleError).toHaveBeenCalledWith(errorResponse);
          expect(error).toBe(malformedError);
          done();
        }
      });
    });

    it('should handle null or undefined error responses', (done) => {
      const errorResponse = new HttpErrorResponse({
        error: null,
        status: 400,
        statusText: 'Bad Request'
      });

      errorService.handleError.and.returnValue(throwError(() => null));

      const response$ = throwError(() => errorResponse);

      service.extractBody(response$).subscribe({
        next: () => {
          done.fail('Should have been an error');
        },
        error: (error) => {
          expect(errorService.handleError).toHaveBeenCalledWith(errorResponse);
          expect(error).toBeNull();
          done();
        }
      });
    });
  });
});