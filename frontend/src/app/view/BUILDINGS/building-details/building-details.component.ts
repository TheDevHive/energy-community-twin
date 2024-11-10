// building-details.component.ts
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { BuildingService } from '../../../services/building.service';
import { BuildingDeviceService } from '../../../services/building-device.service';
import { ApartmentService } from '../../../services/apartment.service';
import { Building } from '../../../models/building';
//import { Device } from '../../../models/device';
import { BuildingDevice } from '../../../models/building_device';
import { Apartment } from '../../../models/apartment';
import { ErrorType } from '../../../models/api-error';
import { AlertService } from '../../../services/alert.service';
import { ConfirmationDialogComponent } from '../../SHARED/confirmation-dialog/confirmation-dialog.component';
//import { AddDeviceComponent } from '../add-device/add-device.component';
//import { AddApartmentComponent } from '../add-apartment/add-apartment.component';
import { CommunityService } from '../../../services/community.service';

import { B_DEVICES } from '../../../MOCKS/B_DEVICES';
import { APARTMENTS } from '../../../MOCKS/APARTMENTS';

@Component({
  selector: 'app-building-details',
  templateUrl: './building-details.component.html',
  styleUrls: ['./building-details.component.css']
})
export class BuildingDetailsComponent implements OnInit, AfterViewInit {
  building?: Building;
  communityId?: number;
  communityName?: string;
  loading = false;
  error?: { type: ErrorType; message: string };

  devices: BuildingDevice[] = [];
  deviceColumns: string[] = ['id', 'name', 'energy', 'energyClass', 'actions'];
  deviceDataSource: MatTableDataSource<BuildingDevice>;

  apartments: Apartment[] = [];
  apartmentColumns: string[] = ['id', 'residents', 'squareFootage', 'energyClass', 'energyProduction', 'energyConsumption', 'energyDifference', 'actions'];
  apartmentDataSource: MatTableDataSource<Apartment>;

  @ViewChild('devicePaginator') devicePaginator!: MatPaginator;
  @ViewChild('deviceSort') deviceSort!: MatSort;
  @ViewChild('apartmentPaginator') apartmentPaginator!: MatPaginator;
  @ViewChild('apartmentSort') apartmentSort!: MatSort;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private buildingService: BuildingService,
    private buildingDeviceService: BuildingDeviceService,
    private apartmentService: ApartmentService,
    private modalService: NgbModal,
    private alert: AlertService,
    private communityService: CommunityService
  ) {
    this.deviceDataSource = new MatTableDataSource();
    this.apartmentDataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const buildingId = params.get('buildingId'); // Use 'buildingId' instead of 'id'
      if (buildingId) {
        this.loadBuildingDetails(+buildingId);
      }
    });
  }

  ngAfterViewInit() {
    this.setupSorting();
  }

  private setupSorting() {
    // Device table sorting
    this.deviceDataSource.paginator = this.devicePaginator;
    this.deviceDataSource.sort = this.deviceSort;
    this.deviceDataSource.sortingDataAccessor = (item: any, property: string) => {
      switch (property) {
        case 'energy': return item.energy;
        case 'energyClass': return item.energyClass;
        default: return item[property];
      }
    };

    // Apartment table sorting
    this.apartmentDataSource.paginator = this.apartmentPaginator;
    this.apartmentDataSource.sort = this.apartmentSort;
    this.apartmentDataSource.sortingDataAccessor = (item: any, property: string) => {
      switch (property) {
        case 'energyProduction': return item.stats.energyProduction;
        case 'energyConsumption': return item.stats.energyConsumption;
        case 'energyDifference': return this.calculateEnergyDifference(item);
        default: return item[property];
      }
    };

    console.log(this.devicePaginator);
  }

  private loadBuildingDetails(buildingId: number): void {
    this.loading = true;
    this.error = undefined;

    this.buildingService.getBuilding(buildingId).subscribe({
      next: (building) => {
        this.building = building;
        this.loadCommunityName(building.community.id);
        this.loadDevices(buildingId);
        this.loadApartments(buildingId);
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  private loadCommunityName(communityId: number): void {
    this.communityService.getCommunity(communityId).subscribe({
      next: (community) => {
        this.communityName = community.name;
      },
      error: (error) => {
        this.error = error;
      }
    });
  }

  private loadDevices(buildingId: number): void {
    this.loading = true;
    this.error = undefined;

    // Reassign paginator after data is loaded
    setTimeout(() => {
      this.deviceDataSource.paginator = this.devicePaginator;
    });

    this.buildingService.getDevices(buildingId).subscribe({
      next: (devices) => {
        console.log(devices);
        this.deviceDataSource.data = devices;

        // Reassign paginator after data is loaded
        setTimeout(() => {
        this.deviceDataSource.paginator = this.devicePaginator;
        });
    
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  private loadApartments(buildingId: number): void {
    this.loading = true;
    this.error = undefined;



    // Reassign paginator after data is loaded
    setTimeout(() => {
      this.apartmentDataSource.paginator = this.apartmentPaginator;
    });

    this.buildingService.getApartments(buildingId).subscribe({
      next: (apartments) => {
        this.apartments = apartments;
        this.apartmentService.getStats().subscribe({
          next: (stats) => {
            this.apartments.forEach(apartment => {
              apartment.stats = stats.find(stat => stat.apartmentId === apartment.id) || { apartmentId: apartment.id, energyClass: '', energyProduction: 0, energyConsumption: 0 };
            });
            this.apartmentDataSource.data = this.apartments;

            // Reassign paginator after data is loaded
            setTimeout(() => {
              this.apartmentDataSource.paginator = this.apartmentPaginator;
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

  // Device related methods
  openAddDeviceDialog(): void {
    /*
    const modalRef = this.modalService.open(AddDeviceComponent, {
      centered: true,
      backdrop: 'static'
    });

    modalRef.result.then(
      (result) => {
        if (result && this.building) {
          this.createDevice(result);
        }
      }
    );
    */
  }

  openEditDeviceDialog(device: BuildingDevice): void {
    /*
    const modalRef = this.modalService.open(AddDeviceComponent, {
      centered: true,
      backdrop: 'static'
    });
    
    modalRef.componentInstance.isEdit = true;
    modalRef.componentInstance.device = device;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.editDevice(result);
        }
      }
    );
    */
  }

  openDeleteDeviceDialog(device: BuildingDevice): void {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, {
      centered: true,
      backdrop: 'static'
    });
    modalRef.componentInstance.title = 'Delete Device';
    modalRef.componentInstance.message = `Are you sure you want to delete device "${device.name}"?`;
    modalRef.componentInstance.confirmText = 'Delete';
    modalRef.componentInstance.cancelText = 'Cancel';
    modalRef.componentInstance.color = 'red';

    modalRef.result.then(
      (confirmed) => {
        if (confirmed) {
          this.deleteDevice(device.id);
        }
      }
    );
  }

  // Apartment related methods
  openAddApartmentDialog(): void {
    /*
    const modalRef = this.modalService.open(AddApartmentComponent, {
      centered: true,
      backdrop: 'static'
    });

    modalRef.result.then(
      (result) => {
        if (result && this.building) {
          this.createApartment(result);
        }
      }
    );
    */
  }

  openEditApartmentDialog(apartment: Apartment): void {
    /*
    const modalRef = this.modalService.open(AddApartmentComponent, {
      centered: true,
      backdrop: 'static'
    });
    
    modalRef.componentInstance.isEdit = true;
    modalRef.componentInstance.apartment = apartment;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.editApartment(result);
        }
      }
    );
    */
  }

  openDeleteApartmentDialog(apartment: Apartment): void {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, {
      centered: true,
      backdrop: 'static'
    });
    modalRef.componentInstance.title = 'Delete Apartment';
    modalRef.componentInstance.message = `Are you sure you want to delete apartment #${apartment.id}?`;
    modalRef.componentInstance.confirmText = 'Delete';
    modalRef.componentInstance.cancelText = 'Cancel';
    modalRef.componentInstance.color = 'red';

    modalRef.result.then(
      (confirmed) => {
        if (confirmed) {
          this.deleteApartment(apartment.id);
        }
      }
    );
  }

  // CRUD operations
  private createDevice(deviceData: any): void {
    /*
    if (!this.building) return;
    
    deviceData.buildingId = this.building.id;
    this.deviceService.createDevice(deviceData).subscribe({
      next: (newDevice) => {
        this.deviceDataSource.data = [...this.deviceDataSource.data, newDevice];
        this.alert.setAlert('success', `Device "${newDevice.name}" created successfully`);
      },
      error: (error) => {
        this.error = error;
        this.alert.setAlert('danger', `Failed to create device: ${error.message}`);
      }
    });
    */
  }

  private editDevice(deviceData: any): void {
    /*
    this.deviceService.updateDevice(deviceData).subscribe({
      next: (updatedDevice) => {
        this.deviceDataSource.data = this.deviceDataSource.data.map(
          device => device.id === updatedDevice.id ? updatedDevice : device
        );
        this.alert.setAlert('success', `Device "${updatedDevice.name}" updated successfully`);
      },
      error: (error) => {
        this.error = error;
        this.alert.setAlert('danger', `Failed to update device: ${error.message}`);
      }
    });
    */
  }

  private deleteDevice(id: number): void {
    /*
    this.deviceService.deleteDevice(id).subscribe({
      next: () => {
        this.deviceDataSource.data = this.deviceDataSource.data.filter(device => device.id !== id);
        this.alert.setAlert('success', 'Device deleted successfully');
      },
      error: (error) => {
        this.error = error;
        this.alert.setAlert('danger', `Failed to delete device: ${error.message}`);
      }
    });
    */
  }

  private createApartment(apartmentData: any): void {
    /*
    if (!this.building) return;
    
    apartmentData.buildingId = this.building.id;
    this.apartmentService.createApartment(apartmentData).subscribe({
      next: (newApartment) => {
        this.apartmentDataSource.data = [...this.apartmentDataSource.data, newApartment];
        this.alert.setAlert('success', 'Apartment created successfully');
      },
      error: (error) => {
        this.error = error;
        this.alert.setAlert('danger', `Failed to create apartment: ${error.message}`);
      }
    });
    */
  }

  private editApartment(apartmentData: any): void {
    /*
    this.apartmentService.updateApartment(apartmentData).subscribe({
      next: (updatedApartment) => {
        this.apartmentDataSource.data = this.apartmentDataSource.data.map(
          apartment => apartment.id === updatedApartment.id ? updatedApartment : apartment
        );
        this.alert.setAlert('success', 'Apartment updated successfully');
      },
      error: (error) => {
        this.error = error;
        this.alert.setAlert('danger', `Failed to update apartment: ${error.message}`);
      }
    });
    */
  }

  private deleteApartment(id: number): void {
    /*
    this.apartmentService.deleteApartment(id).subscribe({
      next: () => {
        this.apartmentDataSource.data = this.apartmentDataSource.data.filter(apartment => apartment.id !== id);
        this.alert.setAlert('success', 'Apartment deleted successfully');
      },
      error: (error) => {
        this.error = error;
        this.alert.setAlert('danger', `Failed to delete apartment: ${error.message}`);
      }
    });
    */
  }

  // Utility methods
  getEnergyIcon(energy: number): string {
    if (energy > 0) {
      return 'bi-arrow-up-right text-success';
    } else if (energy < 0) {
      return 'bi-arrow-down-right text-danger';
    }
    return 'bi-arrow-right text-info';
  }

  calculateEnergyDifference(apartment: Apartment): number {
    return apartment.stats.energyProduction - apartment.stats.energyConsumption;
  }

  getEnergyClassColor(energyClass: string): string {
    const colors: { [key: string]: string } = {
      'A': 'success',
      'B': 'info',
      'C': 'primary',
      'D': 'warning',
      'E': 'danger'
    };
    return colors[energyClass] || 'secondary';
  }

  get totalResidents() {
    return this.apartmentDataSource.data.reduce((sum, apartment) => sum + apartment.residents, 0);
  }

  // Sorting event handlers
  onDeviceSortChange(sort: Sort): void {
    const data = this.deviceDataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.deviceDataSource.data = this.devices;
      return;
    }

    this.deviceDataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'energy': return this.compare(a.energy, b.energy, isAsc);
        case 'energyClass': return this.compare(a.energyClass, b.energyClass, isAsc);
        default: return this.compare(a[sort.active as keyof BuildingDevice], b[sort.active as keyof BuildingDevice], isAsc);
      }
    });
  }

  onApartmentSortChange(sort: Sort): void {
    const data = this.apartmentDataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.apartmentDataSource.data = this.apartments;
      return;
    }

    this.apartmentDataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'energyProduction': return this.compare(a.stats.energyProduction, b.stats.energyProduction, isAsc);
        case 'energyConsumption': return this.compare(a.stats.energyConsumption, b.stats.energyConsumption, isAsc);
        case 'energyDifference': return this.compare(
          this.calculateEnergyDifference(a),
          this.calculateEnergyDifference(b),
          isAsc
        );
        default: {
          const aValue = a[sort.active as keyof Apartment];
          const bValue = b[sort.active as keyof Apartment];
          if (typeof aValue === 'string' || typeof aValue === 'number') {
            return this.compare(aValue, bValue as string | number, isAsc);
          }
          return 0;
        }
      }
    });
  }

  private compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  // Navigation methods
  navigateToCommunity(): void {
    if (this.communityId) {
      this.router.navigate(['/communities', this.communityId]);
    }
  }

  navigateToDevice(id: number): void {
    //this.router.navigate(['/devices', id]);
  }

  navigateToApartment(id: number): void {
    //this.router.navigate(['/apartments', id]);
  }
}