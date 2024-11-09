import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorModalComponent } from '../view/SHARED/error-modal/error-modal.component';
import { ErrorType } from './../models/api-error';
import { ErrorService } from './error.service';

describe('ErrorModalComponent', () => {
  let component: ErrorModalComponent;
  let fixture: ComponentFixture<ErrorModalComponent>;
  let activeModal: jasmine.SpyObj<NgbActiveModal>;
  let errorService: jasmine.SpyObj<ErrorService>;

  beforeEach(async () => {
    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close', 'dismiss']);
    const errorServiceSpy = jasmine.createSpyObj('ErrorService', ['handleError']);

    await TestBed.configureTestingModule({
      declarations: [ErrorModalComponent],
      providers: [
        { provide: NgbActiveModal, useValue: activeModalSpy },
        { provide: ErrorService, useValue: errorServiceSpy }
      ]
    }).compileComponents();

    activeModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default error type', () => {
      expect(component.type).toBe(ErrorType.INTERNAL_SERVER_ERROR);
    });

    it('should initialize with empty message', () => {
      expect(component.message).toBe('');
    });

    it('should expose activeModal to template', () => {
      expect(component.activeModal).toBeTruthy();
    });
  });

  describe('Error Titles', () => {
    it('should display correct title for validation error', () => {
      component.type = ErrorType.VALIDATION_ERROR;
      fixture.detectChanges();
      expect(component.title).toBe('Errore di Validazione');
    });

    it('should display correct title for resource not found', () => {
      component.type = ErrorType.RESOURCE_NOT_FOUND;
      fixture.detectChanges();
      expect(component.title).toBe('Risorsa Non Trovata');
    });

    it('should display correct title for duplicate resource', () => {
      component.type = ErrorType.DUPLICATE_RESOURCE;
      fixture.detectChanges();
      expect(component.title).toBe('Risorsa Duplicata');
    });

    it('should display correct title for unauthorized', () => {
      component.type = ErrorType.UNAUTHORIZED;
      fixture.detectChanges();
      expect(component.title).toBe('Non Autorizzato');
    });

    it('should display correct title for forbidden', () => {
      component.type = ErrorType.FORBIDDEN;
      fixture.detectChanges();
      expect(component.title).toBe('Accesso Negato');
    });

    it('should display correct title for internal server error', () => {
      component.type = ErrorType.INTERNAL_SERVER_ERROR;
      fixture.detectChanges();
      expect(component.title).toBe('Errore del Server');
    });

    it('should display default title for unknown error type', () => {
      component.type = 'UNKNOWN' as ErrorType;
      fixture.detectChanges();
      expect(component.title).toBe('Errore');
    });
  });

  describe('Icon Classes', () => {
    it('should return warning icon for validation error', () => {
      component.type = ErrorType.VALIDATION_ERROR;
      expect(component.iconClass).toContain('bi-exclamation-triangle-fill');
      expect(component.iconClass).toContain('text-warning');
    });

    it('should return warning icon for duplicate resource', () => {
      component.type = ErrorType.DUPLICATE_RESOURCE;
      expect(component.iconClass).toContain('bi-exclamation-triangle-fill');
      expect(component.iconClass).toContain('text-warning');
    });

    it('should return info icon for resource not found', () => {
      component.type = ErrorType.RESOURCE_NOT_FOUND;
      expect(component.iconClass).toContain('bi-info-circle-fill');
      expect(component.iconClass).toContain('text-info');
    });

    it('should return danger icon for unauthorized', () => {
      component.type = ErrorType.UNAUTHORIZED;
      expect(component.iconClass).toContain('bi-x-circle-fill');
      expect(component.iconClass).toContain('text-danger');
    });

    it('should return danger icon for forbidden', () => {
      component.type = ErrorType.FORBIDDEN;
      expect(component.iconClass).toContain('bi-x-circle-fill');
      expect(component.iconClass).toContain('text-danger');
    });

    it('should return danger icon for internal server error', () => {
      component.type = ErrorType.INTERNAL_SERVER_ERROR;
      expect(component.iconClass).toContain('bi-x-circle-fill');
      expect(component.iconClass).toContain('text-danger');
    });

    it('should return question icon for unknown error type', () => {
      component.type = 'UNKNOWN' as ErrorType;
      expect(component.iconClass).toContain('bi-question-circle-fill');
    });
  });

  describe('Modal Header Classes', () => {
    it('should return warning class for validation error', () => {
      component.type = ErrorType.VALIDATION_ERROR;
      expect(component.modalHeaderClass).toBe('warning');
    });

    it('should return warning class for duplicate resource', () => {
      component.type = ErrorType.DUPLICATE_RESOURCE;
      expect(component.modalHeaderClass).toBe('warning');
    });

    it('should return info class for resource not found', () => {
      component.type = ErrorType.RESOURCE_NOT_FOUND;
      expect(component.modalHeaderClass).toBe('info');
    });

    it('should return error class for unauthorized', () => {
      component.type = ErrorType.UNAUTHORIZED;
      expect(component.modalHeaderClass).toBe('error');
    });

    it('should return error class for forbidden', () => {
      component.type = ErrorType.FORBIDDEN;
      expect(component.modalHeaderClass).toBe('error');
    });

    it('should return error class for internal server error', () => {
      component.type = ErrorType.INTERNAL_SERVER_ERROR;
      expect(component.modalHeaderClass).toBe('error');
    });

    it('should return empty string for unknown error type', () => {
      component.type = 'UNKNOWN' as ErrorType;
      expect(component.modalHeaderClass).toBe('');
    });
  });

  describe('Button Classes', () => {
    it('should return warning button class for validation error', () => {
      component.type = ErrorType.VALIDATION_ERROR;
      expect(component.buttonClass).toBe('btn-warning');
    });

    it('should return warning button class for duplicate resource', () => {
      component.type = ErrorType.DUPLICATE_RESOURCE;
      expect(component.buttonClass).toBe('btn-warning');
    });

    it('should return info button class for resource not found', () => {
      component.type = ErrorType.RESOURCE_NOT_FOUND;
      expect(component.buttonClass).toBe('btn-info');
    });

    it('should return error button class for unauthorized', () => {
      component.type = ErrorType.UNAUTHORIZED;
      expect(component.buttonClass).toBe('btn-error');
    });

    it('should return error button class for forbidden', () => {
      component.type = ErrorType.FORBIDDEN;
      expect(component.buttonClass).toBe('btn-error');
    });

    it('should return error button class for internal server error', () => {
      component.type = ErrorType.INTERNAL_SERVER_ERROR;
      expect(component.buttonClass).toBe('btn-error');
    });

    it('should return secondary button class for unknown error type', () => {
      component.type = 'UNKNOWN' as ErrorType;
      expect(component.buttonClass).toBe('btn-secondary');
    });
  });

  describe('UI Elements', () => {
    it('should display error message in modal body', () => {
      component.message = 'Test error message';
      fixture.detectChanges();
      const modalBody = fixture.nativeElement.querySelector('.modal-body');
      expect(modalBody.textContent).toContain('Test error message');
    });

    it('should display close button in modal footer', () => {
      const closeButton = fixture.nativeElement.querySelector('.modal-footer button');
      expect(closeButton.textContent).toContain('Chiudi');
    });

    it('should display error icon in modal header', () => {
      const icon = fixture.nativeElement.querySelector('.modal-header i');
      expect(icon).toBeTruthy();
    });

    it('should apply correct CSS classes based on error type', () => {
      component.type = ErrorType.VALIDATION_ERROR;
      fixture.detectChanges();
      const modalHeader = fixture.nativeElement.querySelector('.modal-header');
      expect(modalHeader.classList).toContain('warning');
    });
  });

  describe('Modal Interactions', () => {
    it('should close modal when close button is clicked', () => {
      const closeButton = fixture.nativeElement.querySelector('.modal-footer button');
      closeButton.click();
      expect(activeModal.close).toHaveBeenCalled();
    });

    it('should dismiss modal when dismiss button is clicked', () => {
      const dismissButton = fixture.nativeElement.querySelector('.btn-close');
      dismissButton.click();
      expect(activeModal.dismiss).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label on close button', () => {
      const closeButton = fixture.nativeElement.querySelector('.btn-close');
      expect(closeButton.getAttribute('aria-label')).toBe('Close');
    });

    it('should have appropriate heading structure', () => {
      const heading = fixture.nativeElement.querySelector('.modal-title');
      expect(heading.tagName.toLowerCase()).toBe('h4');
    });
  });
});