import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Building } from '../../models/building';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-building',
  templateUrl: './add-building.component.html',
  styleUrls: ['./add-building.component.css']
})
export class AddBuildingComponent implements OnInit {
  buildingForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {
    this.buildingForm = this.fb.group({
      address: ['', [Validators.required, this.noWhitespaceValidator]],
      floors: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() { }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  onSubmit(): void {
    if (this.buildingForm.valid && !this.loading) {
      this.loading = true;

      const newBuilding: Building = {
        ...this.buildingForm.value,
        address: this.buildingForm.get('address')?.value?.trim()
      };

      this.activeModal.close(newBuilding);
      this.loading = false;
    } else {
      this.markAllControlsAsTouched();
    }
  }

  private markAllControlsAsTouched(): void {
    Object.keys(this.buildingForm.controls).forEach(controlName => {
      this.buildingForm.get(controlName)?.markAsTouched();
    });
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
