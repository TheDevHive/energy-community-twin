import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BuildingDevice } from '../../models/building_device';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent implements OnInit {
  deviceForm: FormGroup;
  loading = false;

  @Input() id!: number; // This will be the building_id
  @Input() isBuildingDevice!: boolean;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {
    // Initialize the form with validators
    this.deviceForm = this.fb.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      consumesEnergy: [false, Validators.required],
      energyClass: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  // Custom validator to prevent only whitespace in the name field
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    return !isWhitespace ? null : { whitespace: true };
  }

  // Dismiss the modal without any data
  dismiss(): void {
    this.activeModal.dismiss('Modal dismissed');
  }

  // Submit the form data if valid
  onSubmit(): void {
    if (this.deviceForm.invalid) {
      this.markAllControlsAsTouched();
      return;
    }

    this.loading = true;

    // Create a BuildingDevice object using form data and this.id as building_id
    const newBuildingDevice: BuildingDevice = {
      id: 0, // id will be set on the server or database side
      name: this.deviceForm.get('name')?.value?.trim(),
      log_path: '', // log_path can be set later or on the server side
      consumes_energy: this.deviceForm.get('consumesEnergy')?.value,
      energy_class: this.deviceForm.get('energyClass')?.value,
      building_id: this.id // Use the passed building_id from the parent component
    };

    // Close the modal and pass the new device data
    this.activeModal.close(newBuildingDevice);
    this.loading = false;
  }

  // Mark all form controls as touched to trigger validation messages
  private markAllControlsAsTouched(): void {
    Object.keys(this.deviceForm.controls).forEach(controlName => {
      this.deviceForm.get(controlName)?.markAsTouched();
    });
  }
}
