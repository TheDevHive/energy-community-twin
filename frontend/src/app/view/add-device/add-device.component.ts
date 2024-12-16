import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Building } from '../../models/building';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BuildingDevice } from '../../models/building_device';
import { ApartmentDevice } from '../../models/apartment_device';
import { Apartment } from '../../models/apartment';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent implements OnInit {
  @Input() isEdit: boolean = false;
  @Input() device!: BuildingDevice | ApartmentDevice;
  @Input() building!: Building;
  @Input() apartment!: Apartment;
  @Input() isBuildingDevice!: boolean;
  @Input() battery: boolean = false;
  energy_value: number = 50;
  deviceForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {
    this.deviceForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      consumesEnergy: [1, Validators.required],
      capacity: [0, Validators.required],
      windSensitivity: [0],
      lightSensitivity: [0],
      temperatureSensitivity: [0],
      precipitationSensitivity: [0]
    });
  }

  ngOnInit() {

    if (this.battery) {
      this.deviceForm.get('capacity')?.setValidators([Validators.required, this.noZeroValidator]);
    }
  
    // Initialize form with existing data if in edit mode
    if (this.isEdit && this.device) {
      this.deviceForm.get('capacity')?.updateValueAndValidity();
      const formValues = {
        id: this.device.id,
        name: this.device.name,
        consumesEnergy: this.device.consumesEnergy,
        capacity: this.device.energy_curve.energyCurve[0],
        windSensitivity: this.device.windSensitivity || 0,
        lightSensitivity: this.device.lightSensitivity || 0,
        temperatureSensitivity: this.device.temperatureSensitivity || 0,
        precipitationSensitivity: this.device.precipitationSensitivity || 0
      };

      if (this.isBuildingDevice) {
        this.deviceForm.patchValue({
          ...formValues,
          building: this.building
        });
      } else {
        this.deviceForm.patchValue({
          ...formValues,
          apartment: this.apartment
        });
      }
    }
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  noZeroValidator(control: AbstractControl) {
    const isZero = control.value === 0;
    const isValid = !isZero;
    return isValid ? null : { zero: true };
  }

  onSubmit(): void {
    if (this.deviceForm.valid && !this.loading) {
      this.loading = true;
      if (this.battery) {
        this.energy_value = this.deviceForm.get('capacity')?.value;
        if (this.isEdit) {
          this.device.energy_curve.energyCurve = Array(24).fill(this.energy_value);
        }
      }

      const deviceData = {
        ...this.device,
        id: this.isEdit && this.device ? this.device.id : 0,
        name: this.deviceForm.get('name')?.value?.trim(),
        consumesEnergy: this.deviceForm.get('consumesEnergy')?.value,
        windSensitivity: this.deviceForm.get('windSensitivity')?.value,
        lightSensitivity: this.deviceForm.get('lightSensitivity')?.value,
        temperatureSensitivity: this.deviceForm.get('temperatureSensitivity')?.value,
        precipitationSensitivity: this.deviceForm.get('precipitationSensitivity')?.value,
        energy_curve: this.isEdit && this.device?.energy_curve
          ? this.device.energy_curve
          : {
              energyCurve: Array(24).fill(this.energy_value)
            },
        building: this.isBuildingDevice ? this.building : undefined,
        apartment: !this.isBuildingDevice ? this.apartment : undefined
      };

      this.activeModal.close(deviceData);
      this.loading = false;
    } else {
      this.markAllControlsAsTouched();
    }
  }

  private markAllControlsAsTouched(): void {
    Object.keys(this.deviceForm.controls).forEach(controlName => {
      this.deviceForm.get(controlName)?.markAsTouched();
    });
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }

  onCheckboxChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.deviceForm.get('consumesEnergy')?.setValue(isChecked ? 0 : 1);
  }

  onSensitivityChange(event: Event, sensitivityType: string): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.deviceForm.get(sensitivityType)?.setValue(isChecked ? 1 : 0);
  }
}