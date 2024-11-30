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
    this.simulationForm = this.fb.group({
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.simulationForm.valid && !this.loading) {
      this.loading = true;

      // Get the start and end dates from the form
      const startDate = new Date(this.simulationForm.get('startDate')?.value);
      const endDate = new Date(this.simulationForm.get('endDate')?.value);

      // Add one day to both dates
      startDate.setDate(startDate.getDate() + 1);
      endDate.setDate(endDate.getDate() + 1);

      const simulationData: TimeRange = {
        start: startDate.toISOString(),
        end: endDate.toISOString()
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
