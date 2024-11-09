import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuildingService } from '../../../services/building.service';
import { Building } from '../../../models/building';
import { AddBuildingComponent } from '../add-building/add-building.component';
import { Router } from '@angular/router';
import { ErrorType } from '../../../models/api-error';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

import { CommunityService } from '../../../services/community.service';

import { ViewChild } from '@angular/core';
import { AlertService } from '../../../services/alert.service';
import { ConfirmationDialogComponent } from '../../SHARED/confirmation-dialog/confirmation-dialog.component';
import { AlertComponent } from '../../SHARED/alert/alert.component';
import { ActivatedRoute } from '@angular/router';

import { BUILDINGS } from '../../../MOCKS/BUILDINGS';

@Component({
  selector: 'app-buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.css']
})
export class BuildingsComponent implements OnInit, AfterViewInit {
  buildings: Building[] = [];
  loading = false;
  error?: { type: ErrorType; message: string };

  communityId = 0;
  communityName = 'Community Name';

  displayedColumns: string[] = ['id', 'address', 'floors', 'apartments', 'members', 'energyProduction', 'energyConsumption', 'energyDifference', 'actions'];
  dataSource: MatTableDataSource<Building>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private communityService: CommunityService,
    private buildingService: BuildingService,
    private modalService: NgbModal,
    private router: Router,
    private alert: AlertService,
    private route: ActivatedRoute
  ) {    
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const communityID = params.get('id');
      if (communityID !== null) {
        this.communityId = +communityID;
        this.setCommunityName(+communityID);
        this.loadBuildings(+communityID);
      } else {
        // Handle error
      }
    });
  }

  setCommunityName(communityId: number): void {
    this.communityService.getCommunity(communityId).subscribe({
      next: (community) => {
        this.communityName = community.name;
      },
      error: (error) => {
        this.error = error;
      }
    });
  }

  private loadBuildings(communityId: number): void {
    this.loading = true;
    this.error = undefined;

    
    this.communityService.getBuildings(communityId).subscribe({
      next: (buildings) => {
        this.buildings = buildings;
        this.buildingService.getStats().subscribe({
          next: (stats) => {
            this.buildings.forEach((building) => {
              building.stats = stats.find((stat) => stat.buildingId === building.id)!;
            });
            this.dataSource.data = this.buildings;
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
  
  openAddBuildingDialog(): void {
    const modalRef = this.modalService.open(AddBuildingComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'building-modal'
    });

    modalRef.result.then(
      (result) => {
        if (result) {
          this.createBuilding(result);
        }
      },
      (reason) => {
        // Modal dismissed
      }
    );
  }

  openEditBuildingDialog(building: Building): void {
    const modalRef = this.modalService.open(AddBuildingComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'building-modal'
    });
  
    modalRef.componentInstance.isEdit = true;
    modalRef.componentInstance.buildingForm.patchValue({
      id: building.id,
      address: building.address,
      floors: building.floors,
      stats: {
        buildingId: building.stats.buildingId,
        apartments: building.stats.apartments,
        members: building.stats.members,
        energyProduction: building.stats.energyProduction,
        energyConsumption: building.stats.energyConsumption
      }
    });
  
    modalRef.result.then(
      (result) => {
        if (result) {
          this.editBuilding(result);
        }
      },
      (reason) => {
        // Modal dismissed
      }
    );
  }

  openDeleteBuildingDialog(building: Building): void {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, {
      centered: true,
      backdrop: 'static'
    });
    modalRef.componentInstance.title = 'Confirm Delete';
    modalRef.componentInstance.message = `Are you sure you want to delete building <strong>${building.address}</strong>?`;
    modalRef.componentInstance.confirmText = 'Delete';
    modalRef.componentInstance.cancelText = 'Cancel';
    modalRef.componentInstance.color = 'red';

    modalRef.result.then(
      (confirmed) => {
        if (confirmed) {
          this.deleteBuilding(building.id);
        }
      },
      () => {
        // Handle dismissal
      }
    );
  }
  
  private createBuilding(buildingData: any): void {
    this.loading = true;
    this.error = undefined;

    buildingData.community = { id: this.communityId };
    this.buildingService.createBuilding(buildingData).subscribe({
      next: (newBuilding) => {
        newBuilding.stats = {
          buildingId: newBuilding.id,
          apartments: 0,
          members: 0,
          energyProduction: 0,
          energyConsumption: 0
        };
        this.buildings = [...this.buildings, newBuilding];
        this.dataSource.data = this.buildings;
        this.loading = false;
        this.alert.setAlertBuildings('success', `Building at <strong>${newBuilding.address}</strong> created successfully`);
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  private editBuilding(buildingData: any): void {
    this.loading = true;
    this.error = undefined;

    buildingData.id = buildingData.id;
    buildingData.community = { id: this.communityId };
    this.buildingService.updateBuilding(buildingData).subscribe({
      next: (updatedBuilding) => {
        updatedBuilding.stats = this.buildings.find((building) => building.id === updatedBuilding.id)!.stats;
        this.buildings = this.buildings.map((building) => {
          if (building.id === updatedBuilding.id) {
            return updatedBuilding;
          }
          return building;
        });
        this.dataSource.data = this.buildings;
        this.loading = false;
        this.alert.setAlertBuildings('success', `Building updated successfully`);
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
        this.alert.setAlertBuildings('danger', `Failed to update building: <strong>${error.message}</strong>`);
      }
    });
    
  }

  private deleteBuilding(id: number): void {
    this.loading = true;
    this.error = undefined;

    this.buildingService.removeBuilding(id).subscribe({
      next: () => {
        this.buildings = this.buildings.filter((building) => building.id !== id);
        this.dataSource.data = this.buildings;
        this.loading = false;
        this.alert.setAlertBuildings('success', `Building deleted successfully`);
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
        this.alert.setAlertBuildings('danger', `Failed to delete building: <strong>${error.message}</strong>`);
      }
    });
  }

  navigateToBuilding(id: number): void {
    this.router.navigate(['/buildings', id]);
  }

  totalEnergyProduction(): number {
    return this.dataSource.filteredData.reduce((sum, building) => sum + building.stats.energyProduction, 0);
  }

  totalEnergyConsumption(): number {
    return this.dataSource.filteredData.reduce((sum, building) => sum + building.stats.energyConsumption, 0);
  }  
  
  totalMembers(): number {
    return this.dataSource.filteredData.reduce((sum, building) => sum + building.stats.members, 0);
  }

  totalApartments(): number {
    return this.dataSource.filteredData.reduce((sum, building) => sum + building.stats.apartments, 0);
  }

  energyDifference(building: Building): number {
    return building.stats.energyProduction - building.stats.energyConsumption;
  }

  energyDifferenceIcon(building: Building): string {
    const difference = this.energyDifference(building);
    if (difference > 0) {
      return 'bi-arrow-up-right text-success';
    } else if (difference < 0) {
      return 'bi-arrow-down-right text-danger';
    } else {
      return 'bi-arrow-right text-info';
    }
  }

  onSortChange(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = this.buildings;
    } else {
      this.dataSource.data = this.buildings.slice().sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'id': return this.compare(a.id, b.id, isAsc);
          case 'address': return this.compare(a.address, b.address, isAsc);
          case 'floors': return this.compare(a.floors, b.floors, isAsc);
          case 'apartments': return this.compare(a.stats.apartments, b.stats.apartments, isAsc);
          case 'members': return this.compare(a.stats.members, b.stats.members, isAsc);
          case 'energyProduction': return this.compare(a.stats.energyProduction, b.stats.energyProduction, isAsc);
          case 'energyConsumption': return this.compare(a.stats.energyConsumption, b.stats.energyConsumption, isAsc);
          case 'energyDifference': return this.compare(
            a.stats.energyProduction - a.stats.energyConsumption,
            b.stats.energyProduction - b.stats.energyConsumption,
            isAsc
          );
          default: return 0;
        }
      });
    }
    this.dataSource.paginator = this.paginator;
  }

  private compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}