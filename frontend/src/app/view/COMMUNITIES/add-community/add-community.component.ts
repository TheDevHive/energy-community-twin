import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { id } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-add-community',
  templateUrl: './add-community.component.html',
  styleUrls: ['./add-community.component.css']
})
export class AddCommunityComponent {
  @Input() isEdit: boolean = false;  // Flag to check if it's an edit operation
  communityForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {
    this.communityForm = this.fb.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      id: [''],
      stats: this.fb.group({
        communityId: [''],
        buildings: [''],
        apartments: [''],
        members: [''],
        energyProduction: [''],
        energyConsumption: ['']
      })
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
      const formValue = {
        name: this.communityForm.get('name')?.value?.trim(),
        id: this.communityForm.get('id')?.value,
        stats: {
          communityId: this.communityForm.get('stats.communityId')?.value,
          buildings: this.communityForm.get('stats.buildings')?.value,
          apartments: this.communityForm.get('stats.apartments')?.value,
          members: this.communityForm.get('stats.members')?.value,
          energyProduction: this.communityForm.get('stats.energyProduction')?.value,
          energyConsumption: this.communityForm.get('stats.energyConsumption')?.value
        }
      };
      if (formValue.name) {
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
