import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TimeRange } from '../../../models/time_range';
import { EnergyReportService } from '../../../services/energy-report.service';

@Component({
  selector: 'app-add-simulation',
  templateUrl: './add-simulation.component.html',
  styleUrls: ['./add-simulation.component.css']
})
export class AddSimulationComponent implements OnInit {
  simulationForm: FormGroup;
  loading = false;
  @Input() refUUID?: string;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private energyReportService: EnergyReportService
  ) {
    console.log('ciaooooooo refUUID: ' + this.refUUID);
    this.simulationForm = this.fb.group({
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.simulationForm.valid && !this.loading) {
      this.loading = true;

      const simulationData: TimeRange = {
        start: this.simulationForm.get('startDate')?.value.toISOString(),
        end: this.simulationForm.get('endDate')?.value.toISOString()
      };
      this.energyReportService.generateReport(this.refUUID, simulationData).subscribe(
        () => {
          this.activeModal.close(simulationData);
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
      );
    } else {
      this.markAllControlsAsTouched();
    }
  }

  private markAllControlsAsTouched(): void {
    Object.keys(this.simulationForm.controls).forEach(controlName => {
      this.simulationForm.get(controlName)?.markAsTouched();
    });
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
