import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter, MAT_NATIVE_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { Chart } from 'chart.js';

// Your component imports
import { EnergyReportsComponent } from './energy-reports.component';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../alert/alert.component';
describe('EnergyReportsComponent', () => {
  let component: EnergyReportsComponent;
  let fixture: ComponentFixture<EnergyReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EnergyReportsComponent,
        AlertComponent, // Aggiungi qui
      ],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatExpansionModule,
        MatPaginatorModule,
        ReactiveFormsModule,
        MatTableModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        CommonModule
      ],
      providers: [
        { provide: DateAdapter, useClass: NativeDateAdapter },
        { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
        { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
        { provide: NgbModal, useValue: jasmine.createSpyObj('NgbModal', ['open']) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EnergyReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});