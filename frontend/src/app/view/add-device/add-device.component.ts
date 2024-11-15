import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Building } from '../../models/building';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { id } from '@swimlane/ngx-datatable';
import { BuildingDevice } from '../../models/building_device';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent implements OnInit {
  @Input() isEdit: boolean = false;  // Add this line
  @Input() buildingDevice!: BuildingDevice;  // Add this line to handle existing building data
  @Input() building!: Building;
  @Input() isBuildingDevice!: boolean;
  deviceForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {
    this.deviceForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, this.noWhitespaceValidator]],
    });
  }

  ngOnInit() {
    // Initialize form with existing data if in edit mode
    if (this.isEdit && this.buildingDevice) {
      this.deviceForm.patchValue({
        id: this.buildingDevice.id,
        name: this.buildingDevice.name,
        building: this.building
      });
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
  
      if (this.isBuildingDevice) {
        const buildingData: BuildingDevice = {
          ...this.buildingDevice,
          id: this.isEdit && this.buildingDevice ? this.buildingDevice.id : 0,
          name: this.deviceForm.get('name')?.value?.trim(),
          consumes_energy: true,
          energy_curve: {
            energyCurve: [
              50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50
            ]
          },
          building: this.building
        };
    
        this.activeModal.close(buildingData);
      }
      else {
        // handle apartment device here...
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
}