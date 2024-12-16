import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommunityService } from '../../../services/community.service';
import { Community } from '../../../models/community';
import { AddCommunityComponent } from './../add-community/add-community.component';
import { Router } from '@angular/router';
import { ErrorType } from '../../../models/api-error';

import { COMMUNITIES } from '../../../MOCKS/COMMUNITIES';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

import { ViewChild } from '@angular/core';
import { AlertService } from '../../../services/alert.service';
import { ConfirmationDialogComponent } from '../../SHARED/confirmation-dialog/confirmation-dialog.component';

import { EnergyReport } from '../../../models/energy-report';
import { TimeSeriesData } from '../../../models/time-series-data';


@Component({
  selector: 'app-communities',
  templateUrl: './communities.component.html',
  styleUrls: ['./communities.component.css']
})
export class CommunitiesComponent implements OnInit, AfterViewInit {
  communities: Community[] = [];
  loading = false;
  error?: { type: ErrorType; message: string };

  displayedColumns: string[] = ['name', 'buildings', 'apartments', 'members', 'energyProduction', 'energyConsumption', 'energyDifference', 'actions'];
  dataSource: MatTableDataSource<Community>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private communityService: CommunityService,
    private modalService: NgbModal,
    private router: Router,
    private alert: AlertService
  ) {    
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.loadCommunities();
  }

  private loadCommunities(): void {
    this.loading = true;
    this.error = undefined;
    this.communityService.getCommunities().subscribe({
      next: (communities) => {
        this.communities = communities;
        this.communityService.getStats().subscribe({
          next: (stats) => {
            console.log(stats);
            this.communities.forEach((community) => {
              community.stats = stats.find((stat) => stat.communityId === community.id)!;
            });

            this.dataSource.data = this.communities;
            
            // Reassign paginator after data is loaded
            setTimeout(() => {
              this.dataSource.paginator = this.paginator;
            });

            this.loading = false;
          },
          error: (error) => {
            this.error = error;
            this.loading = false;
          }
        });
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  openAddCommunityDialog(): void {
    const modalRef = this.modalService.open(AddCommunityComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'community-modal'
    });

    modalRef.result.then(
      (result) => {
        if (result) {
          this.createCommunity(result);
        }
      },
      (reason) => {
        // Modal dismissed
      }
    );
  }

  openEditCommunityDialog(community: Community): void {
    const modalRef = this.modalService.open(AddCommunityComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'community-modal'
    });
  
    modalRef.componentInstance.isEdit = true;  // Pass the isEdit flag
  
    // Pre-fill the form with the community's current name
    modalRef.componentInstance.communityForm.patchValue({
      name: community.name,
      id: community.id,
      stats: {
        communityId: community.stats.communityId,
        buildings: community.stats.buildings,
        apartments: community.stats.apartments,
        members: community.stats.members,
        energyProduction: community.stats.energyProduction,
        energyConsumption: community.stats.energyConsumption
      }
    });
  
    modalRef.result.then(
      (result) => {
        if (result) {
          this.editCommunity(result);
        }
      },
      (reason) => {
        // Modal dismissed
      }
    );
  }

  openDeleteCommunityDialog(community : Community): void {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, {
      centered: true,
      backdrop: 'static'
    });
    modalRef.componentInstance.title = 'Confirm Delete';
    modalRef.componentInstance.message = `Are you sure you want to delete community <strong>${community.name}</strong>?`;
    modalRef.componentInstance.confirmText = 'Delete';
    modalRef.componentInstance.cancelText = 'Cancel';
    modalRef.componentInstance.color = 'red';

    modalRef.result.then(
      (confirmed) => {
        if (confirmed) {
          this.deleteCommunity(community.id);
        }
      },
      () => {
        // Handle dismissal
      }
    );
  }
  
  
  private createCommunity(communityData: {name: string}): void {
    this.loading = true;
    this.error = undefined;

    this.communityService.createCommunity(communityData).subscribe({
      next: (newCommunity) => {
        // create an empty stats object
        newCommunity.stats = {
          communityId: newCommunity.id,
          buildings: 0,
          apartments: 0,
          members: 0,
          energyProduction: 0,
          energyConsumption: 0
        };
        this.communities = [...this.communities, newCommunity];
        this.dataSource.data = this.communities; // Update dataSource
        this.loading = false;
        this.alert.setAlertCommunities('success', `Community <strong>${newCommunity.name}</strong> created successfully`);
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
        //this.alert.setAlertCommunities('danger', `Failed to create community: <strong>${error.message}</strong>`);
      }
    });
  }

  private editCommunity(communityData: Community): void {
    this.loading = true;
    this.error = undefined;

    console.log(communityData);

    this.communityService.updateCommunity(communityData).subscribe({
      next: (updatedCommunity) => {
        updatedCommunity.stats = this.communities.find((community) => community.id === updatedCommunity.id)!.stats;
        this.communities = this.communities.map((community) => {
          if (community.id === updatedCommunity.id) {
            return updatedCommunity;
          }
          return community;
        });
        this.dataSource.data = this.communities; // Update dataSource
        this.loading = false;
        this.alert.setAlertCommunities('success', `Community updated successfully`);
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
        this.alert.setAlertCommunities('danger', `Failed to update community: <strong>${error.message}</strong>`);
      }
    });
  }

  private deleteCommunity(id: number): void {
    this.loading = true;
    this.error = undefined;

    this.communityService.removeCommunity(id).subscribe({
      next: () => {
        this.communities = this.communities.filter((community) => community.id !== id);
        this.dataSource.data = this.communities; // Update dataSource
        this.loading = false;
        this.alert.setAlertCommunities('success', `Community deleted successfully`);
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
        this.alert.setAlertCommunities('danger', `Failed to delete community: <strong>${error.message}</strong>`);
      }
    });
  }
  

  navigateToCommunity(community: Community): void {
    this.router.navigate(['/communities', community.id]);
  }

  totalEnergyProduction(): number {
    return Math.round((this.dataSource.filteredData.reduce((sum, community) => sum + community.stats.energyProduction, 0)) * 100) / 100;
  }

  totalEnergyConsumption(): number {
    return Math.round((this.dataSource.filteredData.reduce((sum, community) => sum + community.stats.energyConsumption, 0)) * 100) / 100;
  }  
  
  totalMembers(): number {
    return this.dataSource.filteredData.reduce((sum, community) => sum + community.stats.members, 0);
  }

  energyDifference(community: Community): number {
    return Math.round((community.stats.energyProduction - community.stats.energyConsumption) * 100) / 100;
  }

  energyDifferenceIcon(community: Community): string {
    const difference = this.energyDifference(community);
    if (difference > 0) {
      return 'bi-arrow-up-right text-success'; // Green up arrow for positive
    } else if (difference < 0) {
      return 'bi-arrow-down-right text-danger'; // Red down arrow for negative
    } else {
      return 'bi-arrow-right text-info'; // Horizontal arrow for zero
    }
  }

  onSortChange(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = this.communities;
    } else {
      this.dataSource.data = this.communities.slice().sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'name': return this.compare(a.name, b.name, isAsc);
          case 'buildings': return this.compare(a.stats.buildings, b.stats.buildings, isAsc);
          case 'apartments': return this.compare(a.stats.apartments, b.stats.apartments, isAsc);
          case 'members': return this.compare(a.stats.members, b.stats.members, isAsc);
          case 'energyProduction': return this.compare(a.stats.energyProduction, b.stats.energyProduction, isAsc);
          case 'energyConsumption': return this.compare(a.stats.energyConsumption, b.stats.energyConsumption, isAsc);
          case 'energyDifference': return this.compare(a.stats.energyProduction - a.stats.energyConsumption, b.stats.energyProduction - b.stats.energyConsumption, isAsc);
          default: return 0;
        }
      });
    }
    this.dataSource.paginator = this.paginator;
  }

  private compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private formatEnergyValue(value: number, should_divide: boolean): { value: number; unit: string } {
    if (should_divide){
      value = value / 24;
    }
    if (Math.abs(value) >= 1000000) {
      return { value: value / 1000000, unit: 'MWh' };
    }
    else if (Math.abs(value) >= 1000) {
      return { value: value / 1000, unit: 'kWh' };
    }
    return { value:( value), unit: 'Wh' };
  }

  formatEnergyDisplay(value: number, should_divide: boolean): string {
    const formatted = this.formatEnergyValue(value, should_divide);
    return `${formatted.value.toFixed(2)} ${formatted.unit}`;
  }
  
}