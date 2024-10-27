import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BuildingService } from '../../services/building.service';
import { CommunityService } from '../../services/community.service';
import { Location } from '@angular/common';
import { Building } from '../../models/building';

@Component({
  selector: 'app-add-building',
  templateUrl: './add-building.component.html',
  styleUrls: ['./add-building.component.scss']
})
export class AddBuildingComponent implements OnInit {
  buildingForm: FormGroup;
  loading = false;
  communityId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private buildingService: BuildingService,
    private communityService: CommunityService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.buildingForm = this.fb.group({
      address: ['', Validators.required],
      floors: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    // Get communityId from query params
    this.route.queryParams.subscribe(params => {
      this.communityId = params['communityId'] ? Number(params['communityId']) : null;
    });
  }

  onSubmit(): void {
    if (this.buildingForm.valid && this.communityId) {
      this.loading = true;
      const building: Building = this.buildingForm.value;
      this.communityService.getCommunity(this.communityId).subscribe( community => {

        building.community = community;
        
        this.buildingService.createBuilding(building).subscribe({
          next: (createdBuilding) => {
            this.loading = false;
            // Navigate back to add community page with the same community ID
            this.router.navigate(['/communities/add'], { 
              queryParams: { communityId: this.communityId }
            });
          },
          error: (error) => {
            console.error('Error creating building:', error);
            this.loading = false;
          }
        });
      });
    }
  }

  goBack(): void {
    // Always navigate back to add community with the community ID
    if (this.communityId) {
      this.router.navigate(['/communities/add'], { 
        queryParams: { communityId: this.communityId }
      });
    } else {
      this.location.back();
    }
  }
}