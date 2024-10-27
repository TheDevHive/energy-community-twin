import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BuildingService } from '../../services/building.service';
import { CommunityService } from '../../services/community.service';
import { Building } from '../../models/building';

@Component({
  selector: 'app-view-building',
  templateUrl: './view-building.component.html',
  styleUrls: ['./view-building.component.scss']
})
export class ViewBuildingComponent implements OnInit {
  building?: Building;
  loading = false;
  communityId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private buildingService: BuildingService,
    private communityService: CommunityService
  ) {
    this.communityId = Number(this.route.snapshot.paramMap.get('communityId'));
  }

  ngOnInit(): void {
    const buildingId = Number(this.route.snapshot.paramMap.get('buildingId'));
    if (buildingId) {
      this.loadBuilding(buildingId);
    }
  }

  loadBuilding(buildingId: number): void {
    this.loading = true;
    this.buildingService.getBuilding(buildingId)
      .subscribe({
        next: building => {
          this.building = building;
          this.loading = false;
        },
        error: error => {
          console.error('Error loading building:', error);
          this.loading = false;
        }
      });
  }

  removeBuilding(): void {
    if (this.building && confirm(`Sei sicuro di voler rimuovere l'edificio in ${this.building.address}?`)) {
      this.loading = true;
      this.communityService.removeBuilding(this.communityId, this.building.id)
        .subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/communities', this.communityId]);
          },
          error: error => {
            console.error('Error removing building:', error);
            this.loading = false;
          }
        });
    }
  }

  goBack(): void {
    this.location.back();
  }
}