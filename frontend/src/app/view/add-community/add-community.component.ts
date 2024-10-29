import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommunityService } from '../../services/community.service';
import { Building } from '../../models/building';

@Component({
  selector: 'app-add-community',
  templateUrl: './add-community.component.html',
  styleUrls: ['./add-community.component.css']
})
export class AddCommunityComponent implements OnInit {
  communityForm: FormGroup;
  selectedBuildings: Building[] = [];
  loading = false;
  tempCommunityId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private communityService: CommunityService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.communityForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Check for existing communityId in query params
    this.route.queryParams.subscribe(params => {
      if (params['communityId']) {
        this.tempCommunityId = Number(params['communityId']);
        
        // Fetch community details to populate the form
        this.communityService.getCommunity(this.tempCommunityId).subscribe(community => {
          this.communityForm.patchValue({
            name: community.name
          });

          // Fetch buildings for this community
          this.loadBuildings();

        });
      }
    });
  }

  loadBuildings(): void {
    if (this.tempCommunityId) {
      this.communityService.getBuildings(this.tempCommunityId).subscribe({
        next: (buildings) => {
          this.selectedBuildings = buildings;
        },
        error: (error) => {
          console.error('Error loading buildings:', error);
        }
      });
    }
  }

  removeBuilding(building: Building): void {
    this.selectedBuildings = this.selectedBuildings.filter(b => b.id !== building.id);
  }

  addNewBuilding(): void {
    if (!this.tempCommunityId && this.communityForm.valid) {
      this.loading = true;
      this.communityService.createCommunity(this.communityForm.value).subscribe(
        community => {
          this.loading = false;
          if (community) {
            this.tempCommunityId = community.id;
            this.router.navigate(['/buildings/add'], {
              queryParams: { communityId: this.tempCommunityId }
            });
          }
        }
      );
    } else if (this.tempCommunityId) {
      this.router.navigate(['/buildings/add'], {
        queryParams: { communityId: this.tempCommunityId }
      });
    }
  }

  onSubmit(): void {
    if (this.communityForm.valid) {
      if (this.tempCommunityId) {
        // Community already exists, just navigate back to communities
        this.router.navigate(['/communities']);
      } else {
        this.loading = true;
        this.communityService.createCommunity(this.communityForm.value)
          .subscribe({
            next: (community) => {
              this.loading = false;
              this.router.navigate(['/communities']);
            },
            error: (error) => {
              console.error('Error creating community:', error);
              this.loading = false;
            }
          });
      }
    }
  }
}