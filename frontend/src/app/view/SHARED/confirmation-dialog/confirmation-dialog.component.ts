// confirmation-dialog.component.ts
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {
  @Input() title = 'Confirmation';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmText = 'Yes';
  @Input() cancelText = 'Cancel';
  @Input() color: 'red' | 'yellow' = 'yellow'; // Default to yellow for warnings

  constructor(public activeModal: NgbActiveModal) {}

  confirm() {
    this.activeModal.close(true);
  }

  cancel() {
    this.activeModal.dismiss(false);
  }
}
