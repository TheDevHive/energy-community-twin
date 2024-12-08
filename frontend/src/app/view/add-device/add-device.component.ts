import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Building } from '../../models/building';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { id } from '@swimlane/ngx-datatable';
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
  @Input() battery: boolean =false;
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
    });
  }

  ngOnInit() {
    // Initialize form with existing data if in edit mode
    if (this.isEdit && this.device) {
      if (this.isBuildingDevice)
      {
        this.deviceForm.patchValue({
          id: this.device.id,
          name: this.device.name,
          consumesEnergy: this.device.consumesEnergy, // Set the correct value for the checkbox
          building: this.building,
          capacity: this.device.energy_curve.energyCurve[0]
        });
      }
      else
      {
        this.deviceForm.patchValue({
          id: this.device.id,
          name: this.device.name,
          consumesEnergy: this.device.consumesEnergy, // Set the correct value for the checkbox
          apartment: this.apartment,
          capacity: this.device.energy_curve.energyCurve[0]
        });
      }
    }
  }
  

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  onSubmit(): void {
    if (this.deviceForm.valid && !this.loading) {
      this.loading = true;
      if(this.battery){
        this.energy_value = this.deviceForm.get('capacity')?.value;
        if(this.isEdit){
          this.device.energy_curve.energyCurve= Array(24).fill(this.energy_value);
        }
      }
      if (this.isBuildingDevice) {
        const bDevice: BuildingDevice = {
          ...this.device,
          id: this.isEdit && this.device ? this.device.id : 0,
          name: this.deviceForm.get('name')?.value?.trim(),
          consumesEnergy: this.deviceForm.get('consumesEnergy')?.value,
          energy_curve: this.isEdit && this.device?.energy_curve
            ? this.device.energy_curve
            : {
                energyCurve: Array(24).fill(this.energy_value)
              },
          building: this.building
        };
    
        this.activeModal.close(bDevice);
      }
      else {

        const aDevice: ApartmentDevice = {
          ...this.device,
          id: this.isEdit && this.device ? this.device.id : 0,
          name: this.deviceForm.get('name')?.value?.trim(),
          consumesEnergy: this.deviceForm.get('consumesEnergy')?.value,
          energy_curve: this.isEdit && this.device?.energy_curve
            ? this.device.energy_curve
            : {
                energyCurve: Array(24).fill(this.energy_value)
              },
          apartment: this.apartment
        };

        this.activeModal.close(aDevice);
      }
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
}

