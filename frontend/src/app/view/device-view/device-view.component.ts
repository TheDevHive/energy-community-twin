import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BuildingDeviceService } from '../../services/building-device.service';
import { BuildingDevice } from '../../models/building_device';
import { EnergySimulatorComponent } from '../energy-simulator/energy-simulator.component';
import { AlertService } from '../../services/alert.service';
import { ApartmentDevice } from '../../models/apartment_device';
import { ApartmentDeviceService } from '../../services/apartment-device.service';
import { Building } from '../../models/building';

interface EnergyData {
  hour: string;
  value: number;
}

@Component({
  selector: 'app-device-view',
  templateUrl: './device-view.component.html',
  styleUrl: './device-view.component.css'
})
export class DeviceViewComponent {
  building?: Building | null;
  deviceId!: number;
  device!: BuildingDevice | ApartmentDevice;
  buildingAddress!: string;
  isBuildingDevice!: boolean;
  communityName!: string;

  energyClassValue!: string;

  @ViewChild(EnergySimulatorComponent) energySimulator!: EnergySimulatorComponent;

  constructor(
    private route: ActivatedRoute,
    private buildingDeviceService: BuildingDeviceService,
    private apartmentDeviceService: ApartmentDeviceService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('id');
    if (uuid == null || (uuid[0] !== 'A' && uuid[0] !== 'B')) return;
  
    if (uuid[0] === 'B')
    {
      this.deviceId = parseInt(uuid.slice(1), 10);
      this.isBuildingDevice = true;
    }
    else
    {
      this.deviceId = parseInt(uuid.slice(1), 10);
      this.isBuildingDevice = false;
    }
    
    this.loadDevice();
  }
  

  ngAfterViewInit(): void {
    if (this.device && this.energySimulator) {
      const energyData: EnergyData[] = this.device.energy_curve.energyCurve.map(
        (value: number, index: number) => ({
          hour: `${index}:00`,
          value,
        })
      );
      this.energySimulator.setEnergyData(energyData);
    }
  }

  loadDevice(): void {

    if (this.isBuildingDevice)
    {
      this.buildingDeviceService.getDevice(this.deviceId).subscribe({
        next: (deviceData: BuildingDevice) => {
          this.device = deviceData;
          this.building = deviceData.building;
  
          this.buildingAddress = deviceData.building?.address || 'Unknown Address';
          this.communityName = deviceData.building?.community?.name || 'Unknown Community';
  
          if (this.energySimulator) {
            const energyData: EnergyData[] = deviceData.energy_curve.energyCurve.map(
              (value: number, index: number) => ({
                hour: `${index}:00`,
                value,
              })
            );
            this.energySimulator.setEnergyData(energyData);
          }
        },
        error: (error) => {
          console.error('Error fetching device data:', error);
        }
      });
    }
    else
    {
      this.apartmentDeviceService.getApartmentDevice(this.deviceId).subscribe({
        next: (deviceData: ApartmentDevice) => {
          this.device = deviceData;
          this.building = deviceData.apartment?.building;
  
          this.buildingAddress = deviceData.apartment?.building?.address || 'Unknown Address';
          this.communityName = deviceData.apartment?.building?.community?.name || 'Unknown Community';
  
          if (this.energySimulator) {
            const energyData: EnergyData[] = deviceData.energy_curve.energyCurve.map(
              (value: number, index: number) => ({
                hour: `${index}:00`,
                value,
              })
            );
            this.energySimulator.setEnergyData(energyData);
          }
        },
        error: (error) => {
          console.error('Error fetching device data:', error);
        }
      });
    }
  }

  energy(device: BuildingDevice | ApartmentDevice): number {
    return device.energy_curve.energyCurve.reduce((sum, value) => sum + value, 0);
  }

  energyClass(device: BuildingDevice | ApartmentDevice): string {
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

  onPatternSaved(updatedEnergyCurve: number[]): void {
    this.device.energy_curve.energyCurve = updatedEnergyCurve;
    this.energyClassValue = this.energyClass(this.device); // Update energy class
    this.alert.setAlertDevice('success', 'Energy pattern saved successfully!');
  }
  
}
