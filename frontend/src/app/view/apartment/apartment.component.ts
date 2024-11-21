import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ApartmentDevice } from '../../models/apartment_device';
import { ApartmentDeviceService } from '../../services/apartment-device.service';
import { ApartmentService } from '../../services/apartment.service';
import { ErrorType } from '../../models/api-error';
import { Apartment } from '../../models/apartment';
import { AlertService } from '../../services/alert.service';
import { CommunityService } from '../../services/community.service';
import { BuildingService } from '../../services/building.service';
import { AddDeviceComponent } from '../add-device/add-device.component';
import { ConfirmationDialogComponent } from '../SHARED/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrl: './apartment.component.css'
})
export class ApartmentComponent implements OnInit, AfterViewInit {
  apartment?: Apartment;
  communityId?: number;
  communityName?: string;
  loading = false;
  error?: { type: ErrorType; message: string };

  devices: ApartmentDevice[] = [];
  deviceColumns: string[] = ['id', 'name', 'energy', 'energyClass', 'actions'];
  deviceDataSource: MatTableDataSource<ApartmentDevice>;

  @ViewChild('devicePaginator') devicePaginator!: MatPaginator;
  @ViewChild('deviceSort') deviceSort!: MatSort;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apartmentService: ApartmentService,
    private apartmentDeviceService: ApartmentDeviceService,
    private modalService: NgbModal,
    private alert: AlertService,
    private communityService: CommunityService,
    private buildingService: BuildingService
  ) {
    this.deviceDataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const apartmentId = params.get('id');
      if (apartmentId) {
        this.loadApartmentDetails(+apartmentId);
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
  }

  private loadApartmentDetails(apartmentId: number): void {
    this.loading = true;
    this.error = undefined;

    this.apartmentService.getApartment(apartmentId).subscribe({
      next: (apartment) => {
        console.log(apartment);
        this.apartment = apartment;
        this.loadCommunityName(apartment.building.community.id);
        this.loadDevices(apartmentId);
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

  private loadDevices(apartmentId: number): void {
    this.loading = true;
    this.error = undefined;

    this.apartmentService.getApartmentDevices(apartmentId).subscribe({
      next: (devices) => {
        this.devices = devices;
        this.deviceDataSource.data = devices;

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

  openAddDeviceDialog(): void {
    const modalRef = this.modalService.open(AddDeviceComponent, {
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.isBuildingDevice = false;
    modalRef.componentInstance.apartment = this.apartment;

    modalRef.result.then(result => {
      this.createDevice(result)
    }
    );
  }

  openEditDeviceDialog(device: ApartmentDevice): void {
    const modalRef = this.modalService.open(AddDeviceComponent, {
      centered: true,
      backdrop: 'static'
    });
    
    modalRef.componentInstance.isEdit = true;
    modalRef.componentInstance.isBuildingDevice = false;
    modalRef.componentInstance.device = device;
    modalRef.componentInstance.apartment = this.apartment;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.editDevice(result);
        }
      }
    );
  }

  openDeleteDeviceDialog(device: ApartmentDevice): void {
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
          console.log(device.id);
          this.deleteDevice(device.id);
        }
      }
    );
  }

  // CRUD operations
  private createDevice(deviceData: any): void {
    deviceData.apartment = this.apartment;
      this.apartmentDeviceService.createApartmentDevice(deviceData).subscribe({
        next: (newDevice: ApartmentDevice) => {
          this.deviceDataSource.data = [...this.deviceDataSource.data, newDevice];
          this.alert.setAlertApartmentDevice('success', `Device <strong>${newDevice.id}</strong> created successfully`);
        },
        error: (error) => {
          this.error = error;
          this.alert.setAlertApartmentDevice('danger', `Failed to create device: ${error.message}`);
        }
      });
  }

  private editDevice(deviceData: any): void {
    this.apartmentDeviceService.updateApartmentDevice(deviceData).subscribe({
      next: (updatedDevice) => {
        this.deviceDataSource.data = this.deviceDataSource.data.map(
          device => device.id === updatedDevice.id ? updatedDevice : device
        );
        this.alert.setAlertApartmentDevice('success', `Device <strong>${updatedDevice.id}</strong> updated successfully`);
      },
      error: (error) => {
        this.error = error;
        this.alert.setAlertApartmentDevice('danger', `Failed to update device: ${error.message}`);
      }
    });
  }

  private deleteDevice(id: number): void {
    this.apartmentDeviceService.removeApartmentDevice(id).subscribe({
      next: () => {
        this.deviceDataSource.data = [...this.deviceDataSource.data.filter(device => device.id !== id)];
        this.alert.setAlertApartmentDevice('success', 'Device deleted successfully');
      },
      error: (error) => {
        this.error = error;
        this.alert.setAlertApartmentDevice('danger', `Failed to delete device: ${error.message}`);
      }
    });
  }

  // Utility methods
  getEnergyDeviceIcon(device: ApartmentDevice): string {
    if (device.consumesEnergy) {
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
          const aValue = a[sort.active as keyof ApartmentDevice];
          const bValue = b[sort.active as keyof ApartmentDevice];
          if (typeof aValue === 'string' || typeof aValue === 'number') {
            return this.compare(aValue, bValue as string | number, isAsc);
          }
          return 0;
        };
      }
    });
  }

  energy(device: ApartmentDevice): number {
    return device.energy_curve.energyCurve.reduce((sum, value) => sum + value, 0);
  }

  energyClass(device: ApartmentDevice): string {
    let energy = this.energy(device);
    if (energy < 1000) {
      return 'A';
    } else if (energy < 5000) {
      return 'B';
    } else if (energy < 10000) {
      return 'C';
    }
    return 'D';
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

  navigateToBuilding(): void {
    if (this.apartment?.id) {
      this.router.navigate(['/buildings', this.apartment?.building?.id]);
    }
  }

  navigateToDevice(id: number): void {
    this.router.navigate(['/devices', 'A' + id.toString()]);
  }
}