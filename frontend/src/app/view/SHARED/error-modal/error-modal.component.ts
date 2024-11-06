import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorType } from '../../../models/api-error';

@Component({
  selector: 'app-error-modal',
  template: `
    <div [class]="'modal-header ' + modalHeaderClass">
      <h4 class="modal-title">
        <i [class]="iconClass" class="me-2"></i>
        {{ title }}
      </h4>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="activeModal.dismiss()">
      </button>
    </div>
    <div class="modal-body">
      <p class="mb-0">{{ message }}</p>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        [class]="'btn ' + buttonClass"
        (click)="activeModal.close()">
        Chiudi
      </button>
    </div>
  `,
  styles: [`
    .modal-header {
      border-radius: 8px 8px 0 0;
    }
    .modal-header.warning { background-color: #fef3c7; }
    .modal-header.info { background-color: #e0f2fe; }
    .modal-header.error { background-color: #fee2e2; }
    
    .modal-title {
      font-size: 1.25rem;
      font-weight: 500;
    }

    .btn-error {
      background-color: #dc2626;
      color: white;
    }
    .btn-error:hover {
      background-color: #b91c1c;
    }

    .btn-warning {
      background-color: #d97706;
      color: white;
    }
    .btn-warning:hover {
      background-color: #b45309;
    }

    .btn-info {
      background-color: #0284c7;
      color: white;
    }
    .btn-info:hover {
      background-color: #0369a1;
    }
  `]
})
export class ErrorModalComponent {
  @Input() type: ErrorType = ErrorType.INTERNAL_SERVER_ERROR;
  @Input() message: string = '';

  constructor(public activeModal: NgbActiveModal) {}

  get title(): string {
    switch (this.type) {
      case ErrorType.VALIDATION_ERROR:
        return 'Errore di Validazione';
      case ErrorType.RESOURCE_NOT_FOUND:
        return 'Risorsa Non Trovata';
      case ErrorType.DUPLICATE_RESOURCE:
        return 'Risorsa Duplicata';
      case ErrorType.UNAUTHORIZED:
        return 'Non Autorizzato';
      case ErrorType.FORBIDDEN:
        return 'Accesso Negato';
      case ErrorType.INTERNAL_SERVER_ERROR:
        return 'Errore del Server';
      default:
        return 'Errore';
    }
  }

  get iconClass(): string {
    switch (this.type) {
      case ErrorType.VALIDATION_ERROR:
      case ErrorType.DUPLICATE_RESOURCE:
        return 'bi bi-exclamation-triangle-fill text-warning';
      case ErrorType.RESOURCE_NOT_FOUND:
        return 'bi bi-info-circle-fill text-info';
      case ErrorType.UNAUTHORIZED:
      case ErrorType.FORBIDDEN:
      case ErrorType.INTERNAL_SERVER_ERROR:
        return 'bi bi-x-circle-fill text-danger';
      default:
        return 'bi bi-question-circle-fill';
    }
  }

  get modalHeaderClass(): string {
    switch (this.type) {
      case ErrorType.VALIDATION_ERROR:
      case ErrorType.DUPLICATE_RESOURCE:
        return 'warning';
      case ErrorType.RESOURCE_NOT_FOUND:
        return 'info';
      case ErrorType.UNAUTHORIZED:
      case ErrorType.FORBIDDEN:
      case ErrorType.INTERNAL_SERVER_ERROR:
        return 'error';
      default:
        return '';
    }
  }

  get buttonClass(): string {
    switch (this.type) {
      case ErrorType.VALIDATION_ERROR:
      case ErrorType.DUPLICATE_RESOURCE:
        return 'btn-warning';
      case ErrorType.RESOURCE_NOT_FOUND:
        return 'btn-info';
      case ErrorType.UNAUTHORIZED:
      case ErrorType.FORBIDDEN:
      case ErrorType.INTERNAL_SERVER_ERROR:
        return 'btn-error';
      default:
        return 'btn-secondary';
    }
  }
}