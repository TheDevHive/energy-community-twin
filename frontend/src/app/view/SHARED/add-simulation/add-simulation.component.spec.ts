import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AddSimulationComponent } from './add-simulation.component';

describe('AddSimulationComponent', () => {
  let component: AddSimulationComponent;
  let fixture: ComponentFixture<AddSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSimulationComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        BrowserAnimationsModule, // Add BrowserAnimationsModule here
        HttpClientTestingModule,
        BrowserAnimationsModule, // Add BrowserAnimationsModule here
        MatNativeDateModule // Add MatNativeDateModule here
      ],
      providers: [NgbActiveModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
