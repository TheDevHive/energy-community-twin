import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergySimulatorComponent } from './energy-simulator.component';
import { DeviceService } from '../../services/device.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('EnergySimulatorComponent', () => {
  let component: EnergySimulatorComponent;
  let fixture: ComponentFixture<EnergySimulatorComponent>;
  let deviceServiceSpy: jasmine.SpyObj<DeviceService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DeviceService', ['saveEnergyPattern']);

    await TestBed.configureTestingModule({
      declarations: [EnergySimulatorComponent],
      providers: [{ provide: DeviceService, useValue: spy }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnergySimulatorComponent);
    component = fixture.componentInstance;
    deviceServiceSpy = TestBed.inject(DeviceService) as jasmine.SpyObj<DeviceService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize data with 24 hours', () => {
    expect(component.data.length).toBe(24);
    expect(component.data[0].hour).toBe('0:00');
    expect(component.data[23].hour).toBe('23:00');
  });

  it('should update selectedScale and data on scale change', () => {
    const event = { target: { value: '1000' } } as unknown as Event;
    component.onScaleChange(event);
    expect(component.selectedScale).toBe(1000);
    expect(component.data.every(d => d.value === 50)).toBeTrue();
  });

  it('should update chart on scale change', () => {
    fixture.detectChanges(); 
    const updateChartSpy = spyOn(component, 'updateChart');
    const event = { target: { value: '500' } } as unknown as Event;
    component.onScaleChange(event);
    expect(updateChartSpy).toHaveBeenCalled();
});

  it('should save pattern successfully', () => {
    component.deviceUuid = 'test-uuid';
    const mockPattern = { energyCurve: component.data.map(d => d.value) };
    deviceServiceSpy.saveEnergyPattern.and.returnValue(of(mockPattern));

    component.savePattern();

    expect(deviceServiceSpy.saveEnergyPattern).toHaveBeenCalledWith('test-uuid', mockPattern);
  });

  it('should handle error when saving pattern', () => {
    component.deviceUuid = 'test-uuid';
    const mockError = new Error('Test error');
    deviceServiceSpy.saveEnergyPattern.and.returnValue(throwError(mockError));
    spyOn(console, 'error');

    component.savePattern();

    expect(deviceServiceSpy.saveEnergyPattern).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error saving pattern:', mockError);
  });

  it('should not save pattern if deviceUuid is not provided', () => {
    spyOn(console, 'error');
    component.savePattern();
    expect(console.error).toHaveBeenCalledWith('No deviceUuid ID provided');
  });

  it('should handle mouse move correctly', () => {
    component.selectedScale = 100;
    component.ngAfterViewInit();
    const event = new MouseEvent('mousemove', { buttons: 1, clientX: 100, clientY: 100 });
    spyOn(component, 'updateChart');
    component.handleMouseMove(event);
    expect(component.updateChart).toHaveBeenCalled();
  });

  it('should create chart on AfterViewInit', () => {
    spyOn(component, 'createChart');
    component.ngAfterViewInit();
    expect(component.createChart).toHaveBeenCalled();
  });

  it('should update chart correctly', () => {
    component.ngAfterViewInit();
    spyOn(component, 'updateChart');
    component.updateChart();
    expect(component.updateChart).toHaveBeenCalled();
  });
});
