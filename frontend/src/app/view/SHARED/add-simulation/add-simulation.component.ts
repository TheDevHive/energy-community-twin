import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-simulation',
  templateUrl: './add-simulation.component.html',
  styleUrls: ['./add-simulation.component.css']
})
export class AddSimulationComponent implements OnInit {
  simulationForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
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

      const simulationData = {
        startDate: this.simulationForm.get('startDate')?.value,
        endDate: this.simulationForm.get('endDate')?.value
      };

      this.activeModal.close(simulationData);
      this.loading = false;
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
