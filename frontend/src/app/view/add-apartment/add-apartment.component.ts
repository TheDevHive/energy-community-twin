import { Component, Input, OnInit } from '@angular/core';
import { Apartment } from '../../models/apartment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-apartment',
  templateUrl: './add-apartment.component.html',
  styleUrl: './add-apartment.component.css'
})
export class AddApartmentComponent implements OnInit {
  @Input() isEdit: boolean = false;
  @Input() apartmentData?: Apartment;
  apartmentForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {
    this.apartmentForm = this.fb.group({
      id: [''],
      residents: [0, [Validators.required, Validators.min(0)]],
      squareFootage: [0, [Validators.required, Validators.min(1)]],
      energyCost: [0.20, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit() {
    if (this.isEdit && this.apartmentData) {
      this.apartmentForm.patchValue({
        id: this.apartmentData.id,
        residents: this.apartmentData.residents,
        squareFootage: this.apartmentData.squareFootage,
        energyCost: this.apartmentData.energyCost
      });
    }
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  onSubmit(): void {
    if (this.apartmentForm.valid && !this.loading) {
      this.loading = true;

      const apartmentData: Apartment = {
        ...this.apartmentData,
        ...this.apartmentForm.value,
        residents: this.apartmentForm.get('residents')?.value,
        squareFootage: this.apartmentForm.get('squareFootage')?.value
      };

      this.activeModal.close(apartmentData);
      this.loading = false;
    } else {
      this.markAllControlsAsTouched();
    }
  }

  private markAllControlsAsTouched(): void {
    Object.keys(this.apartmentForm.controls).forEach(controlName => {
      this.apartmentForm.get(controlName)?.markAsTouched();
    });
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}