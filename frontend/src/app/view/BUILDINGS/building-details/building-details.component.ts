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
import { BuildingDevice } from '../../../models/building_device';
import { Apartment } from '../../../models/apartment';
import { ErrorType } from '../../../models/api-error';
import { AlertService } from '../../../services/alert.service';
import { ConfirmationDialogComponent } from '../../SHARED/confirmation-dialog/confirmation-dialog.component';
import { CommunityService } from '../../../services/community.service';
import { AddApartmentComponent } from '../../add-apartment/add-apartment.component';
import { AddDeviceComponent } from '../../add-device/add-device.component';
import { ApartmentDevice } from '../../../models/apartment_device';

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
  apartmentColumns: string[] = ['id', 'residents', 'squareFootage', 'energyClass', 'energyProduction', 'energyConsumption', 'energyDifference', 'energyCost', 'actions'];
  apartmentDataSource: MatTableDataSource<Apartment>;

  batteries:BuildingDevice[] = [];
  batteryColumns: string[] = ['id', 'name', 'energy', 'energyClass', 'actions'];
  batteryDataSource: MatTableDataSource<BuildingDevice>;


  @ViewChild('devicePaginator') devicePaginator!: MatPaginator;
  @ViewChild('deviceSort') deviceSort!: MatSort;
  @ViewChild('apartmentPaginator') apartmentPaginator!: MatPaginator;
  @ViewChild('apartmentSort') apartmentSort!: MatSort;
  @ViewChild('batteryPaginator') batteryPaginator!: MatPaginator;
  @ViewChild('batterySort') batterySort!: MatSort;



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
    this.batteryDataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.alert.clearAlertBuildingDetails();
    this.route.paramMap.subscribe(params => {
      const buildingId = params.get('buildingId');
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
    this.batteryDataSource.paginator = this.batteryPaginator;
    this.batteryDataSource.sort = this.batterySort;
    this.deviceDataSource.sortingDataAccessor = (item: any, property: string) => {
      switch (property) {
        case 'energy': return item.energy;
        case 'energyClass': return item.energyClass;
        default: return item[property];
      }
    };

    this.batteryDataSource.sortingDataAccessor = (item: any, property: string) => {
      switch (property) {
        case 'energy': return item.energy;
        case 'energyClass': return item.energyClass;
        default: return item[property];
      };
    };

    // Apartment table sorting
    this.apartmentDataSource.paginator = this.apartmentPaginator;
    this.apartmentDataSource.sort = this.apartmentSort;
    this.apartmentDataSource.sortingDataAccessor = (item: any, property: string) => {
      switch (property) {
        case 'energyProduction': return item.stats.energyProduction;
        case 'energyConsumption': return item.stats.energyConsumption;
        case 'energyDifference': return this.calculateEnergyDifference(item);
        case 'energyCost': return item.energyCost;
        default: return item[property];
      }
    };
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

    this.buildingService.getDevices(buildingId).subscribe({
      next: (devices) => {
        this.devices=devices.filter(device => device.consumesEnergy!=-1);
        this.batteries=devices.filter(device => device.consumesEnergy==-1);
        this.deviceDataSource.data = this.devices;
        this.batteryDataSource.data = this.batteries;

        // Reassign paginator after data is loaded
        setTimeout(() => {
          this.batteryDataSource.paginator = this.devicePaginator;
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

  openAddBatteryDialog() {
    const modalRef = this.modalService.open(AddDeviceComponent, {
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.isBuildingDevice = true;
    modalRef.componentInstance.building = this.building;
    modalRef.componentInstance.battery=true;

    modalRef.result.then(result => {
      this.createBattery(result)
    }
    );
  }

  openAddDeviceDialog(): void {
    const modalRef = this.modalService.open(AddDeviceComponent, {
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.isBuildingDevice = true;
    modalRef.componentInstance.building = this.building;

    modalRef.result.then(result => {
      this.createDevice(result)
    }
    );
  }

  openEditBatteryDialog(device: ApartmentDevice): void {
    const modalRef = this.modalService.open(AddDeviceComponent, {
      centered: true,
      backdrop: 'static'
    });
    
    modalRef.componentInstance.isEdit = true;
    modalRef.componentInstance.isBuildingDevice = true;
    modalRef.componentInstance.device = device;
    modalRef.componentInstance.building = this.building;
    modalRef.componentInstance.battery=true;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.editBattery(result);
        }
      }
    );
  }

  openEditDeviceDialog(device: BuildingDevice): void {
    const modalRef = this.modalService.open(AddDeviceComponent, {
      centered: true,
      backdrop: 'static'
    });
    
    modalRef.componentInstance.isEdit = true;
    modalRef.componentInstance.isBuildingDevice = true;
    modalRef.componentInstance.device = device;
    modalRef.componentInstance.building = this.building;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.editDevice(result);
        }
      }
    );
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

  openDeleteBatteryDialog(device: ApartmentDevice): void {
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
          this.deleteBattery(device.id);
        }
      }
    );
  }

  // Apartment related methods
  openAddApartmentDialog(): void {
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
  }

  openEditApartmentDialog(apartment: Apartment): void {
    const modalRef = this.modalService.open(AddApartmentComponent, {
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.isEdit = true;
    modalRef.componentInstance.apartmentForm.patchValue({
      id: apartment.id,
      residents: apartment.residents,
      squareFootage: apartment.squareFootage,
      stats: {
        apartmentId: apartment.stats.apartmentId,
        energyClass: apartment.stats.energyClass,
        energyProduction: apartment.stats.energyProduction,
        energyConsumption: apartment.stats.energyConsumption
      }
    });


    modalRef.result.then(
      (result) => {
        if (result) {
          this.editApartment(result);
        }
      }
    );

  }

  openDeleteApartmentDialog(apartment: Apartment): void {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, {
      centered: true,
      backdrop: 'static'
    });
    modalRef.componentInstance.title = 'Delete Apartment';
    modalRef.componentInstance.message = `Are you sure you want to delete apartment <strong>${apartment.id}</strong>?`;
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
    deviceData.building = this.building;
      this.buildingDeviceService.createDevice(deviceData).subscribe({
        next: (newDevice: BuildingDevice) => {
          this.devices = [...this.devices, newDevice];
          this.deviceDataSource.data = [...this.deviceDataSource.data, newDevice];
          this.alert.setAlertBuildingDevices('success', `Device <strong>${newDevice.id}</strong> created successfully`);
        },
        error: (error) => {
          this.error = error;
          this.alert.setAlertBuildingDevices('danger', `Failed to create device: ${error.message}`);
        }
      });
  }

  private createBattery(deviceData: any): void {
    deviceData.building = this.building;
    deviceData.consumesEnergy = -1;
    this.buildingDeviceService.createDevice(deviceData).subscribe({
      next: (newDevice: BuildingDevice) => {
        this.batteries = [...this.batteries, newDevice];
        this.batteryDataSource.data = [...this.batteryDataSource.data, newDevice];
        this.alert.setAlertBuildingBattery('success', `Device <strong>${newDevice.id}</strong> created successfully`);
     },
      error: (error) => {
        this.error = error;
        this.alert.setAlertBuildingBattery('danger', `Failed to create device: ${error.message}`);
      }
    });
  }

  private editDevice(deviceData: any): void {
    this.buildingDeviceService.updateDevice(deviceData).subscribe({
      next: (updatedDevice) => {
        this.deviceDataSource.data = this.deviceDataSource.data.map(
          device => device.id === updatedDevice.id ? updatedDevice : device
        );
        this.alert.setAlertBuildingDevices('success', `Device <strong>${updatedDevice.id}</strong> updated successfully`);
      },
      error: (error) => {
        this.error = error;
        this.alert.setAlertBuildingDevices('danger', `Failed to update device: ${error.message}`);
      }
    });
  }

  private editBattery(deviceData: any): void {
    this.buildingDeviceService.updateDevice(deviceData).subscribe({
      next: (updatedDevice) => {
        this.batteryDataSource.data = this.batteryDataSource.data.map(
          device => device.id === updatedDevice.id ? updatedDevice : device);
          this.alert.setAlertBuildingBattery('success', `Device <strong>${updatedDevice.id}</strong> updated successfully`);
        },
      error: (error) => {
        this.error = error;
        this.alert.setAlertBuildingBattery('danger', `Failed to update device: ${error.message}`);
      }
    });
  }

  private deleteDevice(id: number): void {
    this.buildingDeviceService.removeDevice(id).subscribe({
      next: () => {
        this.deviceDataSource.data = [...this.deviceDataSource.data.filter(device => device.id !== id)];
        this.alert.setAlertBuildingDevices('success', 'Device deleted successfully');
      },
      error: (error) => {
        this.error = error;
        this.alert.setAlertBuildingDevices('danger', `Failed to delete device: ${error.message}`);
      }
    });
  }

  private deleteBattery(id: number): void {
    this.buildingDeviceService.removeDevice(id).subscribe({
      next: () => {
        this.batteryDataSource.data = [...this.batteryDataSource.data.filter(device => device.id !== id)];
        this.alert.setAlertBuildingBattery('success', 'Device deleted successfully');
      },
      error: (error) => {
        this.error = error;
        this.alert.setAlertBuildingBattery('danger', `Failed to delete device: ${error.message}`);
      }
    });
  }

  private createApartment(apartmentData: any): void {
    this.loading = true;
    this.error = undefined;

    apartmentData.building = this.building;
    this.apartmentService.createApartment(apartmentData).subscribe({
      next: (newApartment) => {
        newApartment.stats = {
          apartmentId: newApartment.id,
          energyClass: '',
          energyProduction: 0,
          energyConsumption: 0
        };
        this.apartments = [...this.apartments, newApartment];
        this.apartmentDataSource.data = this.apartments;
        this.loading = false;
        this.alert.setAlertApartments('success', `Apartment <strong>${newApartment.id}</strong> created successfully`);
        this.loadApartments(this.building!.id);
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }  

  private editApartment(apartmentData: any): void {
    this.loading = true;
    this.error = undefined;

    apartmentData.building = this.building;
    this.apartmentService.updateApartment(apartmentData).subscribe({
      next: (updatedApartment) => {
        updatedApartment.stats = this.apartments.find((apartment) => apartment.id === updatedApartment.id)!.stats;
        this.apartments = this.apartments.map((apartment) => {
          if (apartment.id === updatedApartment.id) {
            return updatedApartment;
          }
          return apartment;
        });
        this.apartmentDataSource.data = this.apartments;
        this.loading = false;
        this.alert.setAlertApartments('success', `Apartment <strong>${updatedApartment.id}</strong> updated successfully`);
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
        this.alert.setAlertApartments('danger', `Failed to update apartment: ${error.message}`);
      }
    });
  }

  private deleteApartment(id: number): void {
    this.loading = true;
    this.error = undefined;

    this.apartmentService.deleteApartment(id).subscribe({
      next: () => {
        this.apartments = this.apartments.filter(apartment => apartment.id !== id);
        this.apartmentDataSource.data = this.apartments;
        this.loading = false;
        this.alert.setAlertApartments('success', 'Apartment deleted successfully');
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
        this.alert.setAlertApartments('danger', `Failed to delete apartment: ${error.message}`);
      }
    });
  }

  // Utility methods
  getEnergyDeviceIcon(device: BuildingDevice): string {
    if (device.consumesEnergy===0) {
      return 'bi-arrow-down-right text-danger';
    }
    return 'bi-arrow-up-right text-success';
  }

  getEnergyIcon(energy: number): string {
    if (energy > 0) {
      return 'bi-arrow-up-right text-success';
    } else if (energy < 0) {
      return 'bi-arrow-down-right text-danger';
    }
    return 'bi-arrow-right text-info';
  }

  calculateEnergyDifference(apartment: Apartment): number {
    return Math.round((apartment.stats.energyProduction - apartment.stats.energyConsumption) * 100) / 100;
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
        case 'energy': return this.compare(this.energy(a), this.energy(b), isAsc);
        case 'energyClass': return this.compare(this.energy(a), this.energy(b), isAsc);
        default: {
          const aValue = a[sort.active as keyof BuildingDevice];
          const bValue = b[sort.active as keyof BuildingDevice];
          if (typeof aValue === 'string' || typeof aValue === 'number') {
            return this.compare(aValue, bValue as string | number, isAsc);
          }
          return 0;
        };
      }
    });
  }

  onBatterySortChange(sort: Sort) {
    const data2 = this.batteryDataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.batteryDataSource.data = this.batteries;
      return;
    }

    this.batteryDataSource.data = data2.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'energy': return this.compare(this.energy(a), this.energy(b), isAsc);
        case 'energyClass': return this.compare(this.energy(a), this.energy(b), isAsc);
        default: {
          const aValue = a[sort.active as keyof BuildingDevice];
          const bValue = b[sort.active as keyof BuildingDevice];
          if (typeof aValue === 'string' || typeof aValue === 'number') {
            return this.compare(aValue, bValue as string | number, isAsc);
          }
          return 0;
        };
      }
    });

  }

  energy(device: BuildingDevice): number {
    return device.energy_curve.energyCurve.reduce((sum, value) => sum + value, 0);
  }

  energyClass(device: BuildingDevice): string {
    let energy = this.energy(device);
    if(device.consumesEnergy==0)
      energy=-energy;
    if(energy<0){
      return 'F'
    }else if(energy<500){
      return 'E';
    } else if (energy < 1000) {
      return 'D';
    } else if (energy < 1500) {
      return 'C';
    } else if (energy < 2000) {
      return 'B';
    } 
    return 'A';
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
        case 'energyCost': return this.compare(a.energyCost, b.energyCost, isAsc);
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
    this.router.navigate(['/devices', 'B' + id.toString()]);
  }

  navigateToApartment(id: number): void {
    this.router.navigate(['/apartments', id]);
  }
}