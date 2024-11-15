import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-community',
  templateUrl: './add-community.component.html',
  styleUrls: ['./add-community.component.css']
})
export class AddCommunityComponent {
  communityForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {
    this.communityForm = this.fb.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]]
    });
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  onSubmit(): void {
    if (this.communityForm.valid && !this.loading) {  // Add loading check
      this.loading = true;
      // Trim whitespace from name
      const formValue = {
        name: this.communityForm.get('name')?.value?.trim()
      };
      if (formValue.name) {  // Only submit if name is not empty after trim
        this.activeModal.close(formValue);
      } else {
        this.loading = false;
        this.communityForm.get('name')?.setErrors({ 'required': true });
      }
    }
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}