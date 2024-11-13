import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergySimulatorComponent } from './energy-simulator.component';

describe('EnergySimulatorComponent', () => {
  let component: EnergySimulatorComponent;
  let fixture: ComponentFixture<EnergySimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnergySimulatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnergySimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
