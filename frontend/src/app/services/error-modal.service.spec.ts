import { TestBed } from '@angular/core/testing';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ErrorModalService } from './error-modal.service';
import { ErrorModalComponent } from '../view/SHARED/error-modal/error-modal.component';
import { ErrorType } from '../models/api-error';

describe('ErrorModalService', () => {
  let service: ErrorModalService;
  let modalService: NgbModal;
  let mockModalRef: jasmine.SpyObj<NgbModalRef>;

  beforeEach(() => {
    // Create a spy object for NgbModalRef
    mockModalRef = jasmine.createSpyObj('NgbModalRef', ['componentInstance', 'close', 'dismiss']);
    // Add componentInstance as a property
    Object.defineProperty(mockModalRef, 'componentInstance', {
      value: {},
      writable: true
    });

    // Create a spy for NgbModal
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    modalServiceSpy.open.and.returnValue(mockModalRef);

    TestBed.configureTestingModule({
      providers: [
        ErrorModalService,
        { provide: NgbModal, useValue: modalServiceSpy }
      ]
    });

    service = TestBed.inject(ErrorModalService);
    modalService = TestBed.inject(NgbModal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('showError', () => {
    it('should open modal with validation error type', () => {
      const errorType = ErrorType.VALIDATION_ERROR;
      const errorMessage = 'Validation failed';

      service.showError(errorType, errorMessage);

      expect(modalService.open).toHaveBeenCalledWith(
        ErrorModalComponent,
        {
          centered: true,
          backdrop: 'static',
          keyboard: false,
          windowClass: 'error-modal'
        }
      );

      expect(mockModalRef.componentInstance.type).toBe(errorType);
      expect(mockModalRef.componentInstance.message).toBe(errorMessage);
    });

    it('should open modal with resource not found error type', () => {
      const errorType = ErrorType.RESOURCE_NOT_FOUND;
      const errorMessage = 'Resource not found';

      service.showError(errorType, errorMessage);

      expect(modalService.open).toHaveBeenCalledWith(
        ErrorModalComponent,
        jasmine.any(Object)
      );

      expect(mockModalRef.componentInstance.type).toBe(errorType);
      expect(mockModalRef.componentInstance.message).toBe(errorMessage);
    });

    it('should open modal with duplicate resource error type', () => {
      const errorType = ErrorType.DUPLICATE_RESOURCE;
      const errorMessage = 'Resource already exists';

      service.showError(errorType, errorMessage);

      expect(modalService.open).toHaveBeenCalledWith(
        ErrorModalComponent,
        jasmine.any(Object)
      );

      expect(mockModalRef.componentInstance.type).toBe(errorType);
      expect(mockModalRef.componentInstance.message).toBe(errorMessage);
    });

    it('should open modal with unauthorized error type', () => {
      const errorType = ErrorType.UNAUTHORIZED;
      const errorMessage = 'Unauthorized access';

      service.showError(errorType, errorMessage);

      expect(modalService.open).toHaveBeenCalledWith(
        ErrorModalComponent,
        jasmine.any(Object)
      );

      expect(mockModalRef.componentInstance.type).toBe(errorType);
      expect(mockModalRef.componentInstance.message).toBe(errorMessage);
    });

    it('should open modal with forbidden error type', () => {
      const errorType = ErrorType.FORBIDDEN;
      const errorMessage = 'Access forbidden';

      service.showError(errorType, errorMessage);

      expect(modalService.open).toHaveBeenCalledWith(
        ErrorModalComponent,
        jasmine.any(Object)
      );

      expect(mockModalRef.componentInstance.type).toBe(errorType);
      expect(mockModalRef.componentInstance.message).toBe(errorMessage);
    });

    it('should open modal with internal server error type', () => {
      const errorType = ErrorType.INTERNAL_SERVER_ERROR;
      const errorMessage = 'Internal server error occurred';

      service.showError(errorType, errorMessage);

      expect(modalService.open).toHaveBeenCalledWith(
        ErrorModalComponent,
        jasmine.any(Object)
      );

      expect(mockModalRef.componentInstance.type).toBe(errorType);
      expect(mockModalRef.componentInstance.message).toBe(errorMessage);
    });

    it('should configure modal with correct options', () => {
      const errorType = ErrorType.VALIDATION_ERROR;
      const errorMessage = 'Test error';

      service.showError(errorType, errorMessage);

      expect(modalService.open).toHaveBeenCalledWith(
        ErrorModalComponent,
        {
          centered: true,
          backdrop: 'static',
          keyboard: false,
          windowClass: 'error-modal'
        }
      );
    });

    it('should handle empty error message', () => {
      const errorType = ErrorType.INTERNAL_SERVER_ERROR;
      const errorMessage = '';

      service.showError(errorType, errorMessage);

      expect(modalService.open).toHaveBeenCalled();
      expect(mockModalRef.componentInstance.message).toBe('');
    });

    it('should handle null error message', () => {
      const errorType = ErrorType.INTERNAL_SERVER_ERROR;
      const errorMessage = null as unknown as string;

      service.showError(errorType, errorMessage);

      expect(modalService.open).toHaveBeenCalled();
      expect(mockModalRef.componentInstance.message).toBe(null);
    });

    it('should pass error type and message to modal component', () => {
      const errorType = ErrorType.VALIDATION_ERROR;
      const errorMessage = 'Test validation error';

      service.showError(errorType, errorMessage);

      expect(mockModalRef.componentInstance.type).toBe(errorType);
      expect(mockModalRef.componentInstance.message).toBe(errorMessage);
    });

    it('should use static backdrop', () => {
      service.showError(ErrorType.VALIDATION_ERROR, 'Test error');

      expect(modalService.open).toHaveBeenCalledWith(
        ErrorModalComponent,
        jasmine.objectContaining({
          backdrop: 'static'
        })
      );
    });

    it('should disable keyboard escape', () => {
      service.showError(ErrorType.VALIDATION_ERROR, 'Test error');

      expect(modalService.open).toHaveBeenCalledWith(
        ErrorModalComponent,
        jasmine.objectContaining({
          keyboard: false
        })
      );
    });

    it('should apply error-modal window class', () => {
      service.showError(ErrorType.VALIDATION_ERROR, 'Test error');

      expect(modalService.open).toHaveBeenCalledWith(
        ErrorModalComponent,
        jasmine.objectContaining({
          windowClass: 'error-modal'
        })
      );
    });
  });
});