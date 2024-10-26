import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityService } from '../../services/community.service';
import { BuildingService } from '../../services/building.service';
import { Building } from '../../models/building';

@Component({
  selector: 'app-add-building',
  templateUrl: './add-building.component.html'
})
export class AddBuildingComponent implements OnInit {
  buildingForm!: FormGroup;
  communityId: number;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    //private building: Building,
    private communityService: CommunityService,
    private buildingService: BuildingService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.communityId = Number(this.route.snapshot.paramMap.get('communityId'));
  }

  ngOnInit(): void {
    this.buildingForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      floors: ['', [Validators.required, Validators.min(1)]],
      apartments: ['', [Validators.required, Validators.min(1)]],
      energyConsumption: ['', [Validators.required, Validators.min(0)]],
      energyProduction: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.buildingForm.valid) {
      this.loading = true;
      this.error = null;
      this.buildingService.createBuilding(this.buildingForm.value).subscribe(
        build => {
          this.communityService.addBuilding(this.communityId, build.id).subscribe({
            next: () => {
              this.router.navigate(['/communities', this.communityId, 'buildings']);
            },
            error: err => {
              this.error = err.message;
              this.loading = false;
            }
          });
        },
      );
      }
  }
}
