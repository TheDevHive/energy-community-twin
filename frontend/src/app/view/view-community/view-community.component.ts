import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityService } from '../../services/community.service';
import { Community } from '../../models/community';
import { Building } from '../../models/building';

@Component({
  selector: 'app-view-community',
  templateUrl: './view-community.component.html',
  styleUrls: ['./view-community.component.css']
})
export class ViewCommunityComponent implements OnInit {
  community?: Community;
  buildings: Building[] = [];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private communityService: CommunityService
  ) {}

  ngOnInit(): void {
    const communityId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCommunity(communityId);
    this.loadBuildings(communityId);
  }

  loadCommunity(communityId: number): void {
    this.loading = true;
    this.communityService.getCommunity(communityId)
      .subscribe({
        next: community => {
          this.community = community;
          this.loading = false;
        },
        error: error => {
          console.error('Error loading community:', error);
          this.loading = false;
        }
      });
  }

  loadBuildings(communityId: number): void {
    this.loading = true;
    this.communityService.getBuildings(communityId)
      .subscribe({
        next: buildings => {
          this.buildings = buildings;
          this.loading = false;
        },
        error: error => {
          console.error('Error loading buildings:', error);
          this.loading = false;
        }
      });
  }

  addBuilding(): void {
    if (this.community) {
      this.router.navigate(['/communities', this.community.id, 'buildings', 'add']);
    }
  }

  removeBuilding(building: Building): void {
    if (this.community && confirm(`Sei sicuro di voler rimuovere l'edificio in ${building.address}?`)) {
      this.loading = true;
      this.communityService.removeBuilding(this.community.id, building.id)
        .subscribe({
          next: () => {
            this.buildings = this.buildings.filter(b => b.id !== building.id);
            this.loading = false;
          },
          error: error => {
            console.error('Error removing building:', error);
            this.loading = false;
          }
        });
    }
  }

  removeCommunity(): void {
    if (this.community && confirm(`Sei sicuro di voler rimuovere la comunità "${this.community.name}"?`)) {
      this.loading = true;
      this.communityService.removeCommunity(this.community.id)
        .subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/communities']);
          },
          error: error => {
            console.error('Error removing community:', error);
            this.loading = false;
          }
        });
    }
  }
}