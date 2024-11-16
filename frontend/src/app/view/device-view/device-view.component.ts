import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BuildingDeviceService } from '../../services/building-device.service';
import { BuildingDevice } from '../../models/building_device';
import { EnergySimulatorComponent } from '../energy-simulator/energy-simulator.component';

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
  deviceId!: number;
  device!: BuildingDevice;
  buildingAddress!: string;
  communityName!: string;

  energyClassValue!: string;

  @ViewChild(EnergySimulatorComponent) energySimulator!: EnergySimulatorComponent;

  constructor(
    private route: ActivatedRoute,
    private buildingDeviceService: BuildingDeviceService
  ) {}

  ngOnInit(): void {
    this.deviceId = +(this.route.snapshot.paramMap.get('id') ?? -1);

    if (this.deviceId === -1) {
      console.error('An error occurred: couldn\'t retrieve the device ID.');
      return;
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
    this.buildingDeviceService.getDevice(this.deviceId).subscribe({
      next: (deviceData: BuildingDevice) => {
        this.device = deviceData;

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

  energy(device: BuildingDevice): number {
    return device.energy_curve.energyCurve.reduce((sum, value) => sum + value, 0);
  }

  energyClass(device: BuildingDevice): string {
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
  }
  
}
