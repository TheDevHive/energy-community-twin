import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorModalComponent } from '../view/SHARED/error-modal/error-modal.component';
import { ErrorType } from '../models/api-error';

@Injectable({
  providedIn: 'root'
})
export class ErrorModalService {
  constructor(private modalService: NgbModal) {}

  showError(type: ErrorType, message: string): void {
    const modalRef = this.modalService.open(ErrorModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      windowClass: 'error-modal'
    });

    modalRef.componentInstance.type = type;
    modalRef.componentInstance.message = message;
  }
}
