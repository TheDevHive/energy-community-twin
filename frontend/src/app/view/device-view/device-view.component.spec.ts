import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { DeviceViewComponent } from './device-view.component';
import { BehaviorSubject, of } from 'rxjs';
import { BuildingDeviceService } from '../../services/building-device.service';
import { AlertComponent } from '../SHARED/alert/alert.component';
import { EnergySimulatorComponent } from '../energy-simulator/energy-simulator.component';
import { DeviceService } from '../../services/device.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

describe('DeviceViewComponent', () => {
  let component: DeviceViewComponent;
  let fixture: ComponentFixture<DeviceViewComponent>;
  let paramMap: BehaviorSubject<ParamMap>;

  beforeEach(async () => {
    const mockDevice = {
      id: 1,
      name: 'Test Device',
      energy_curve: { energyCurve: Array.from({ length: 24 }, (_, i) => 50) }
    };

    class MockBuildingDeviceService {
      getDevice(id: number) {
        return of(mockDevice);
      }
    }

    class MockActivatedRoute {
      snapshot = {
        paramMap: convertToParamMap({ id: '1' })
      };
    }
  
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [DeviceViewComponent, AlertComponent, EnergySimulatorComponent],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: BuildingDeviceService, useClass: MockBuildingDeviceService },
        { provide: DeviceService },
        { provide: NgbModal }
        ],
        schemas: [NO_ERRORS_SCHEMA] 
      }).compileComponents();
  });
  
  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
