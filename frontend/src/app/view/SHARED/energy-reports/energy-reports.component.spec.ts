import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter, MAT_NATIVE_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { Chart } from 'chart.js';

// Your component imports
import { EnergyReportsComponent } from './energy-reports.component';

describe('EnergyReportsComponent', () => {
  let component: EnergyReportsComponent;
  let fixture: ComponentFixture<EnergyReportsComponent>;
  let mockModalService: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    // Create a mock NgbModal service
    mockModalService = jasmine.createSpyObj('NgbModal', ['open']);

    // More comprehensive mock of MediaQueryList
    const matchMediaMock = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: jasmine.createSpy('addListener'),
      removeListener: jasmine.createSpy('removeListener'),
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener'),
      dispatchEvent: jasmine.createSpy('dispatchEvent')
    } as MediaQueryList;

    spyOn(window, 'matchMedia').and.returnValue(matchMediaMock);

    // Mock Chart.js initialization to prevent canvas-related errors
    spyOn(Chart.prototype, 'update');

    // Mock document.getElementById to prevent canvas errors
    spyOn(document, 'getElementById').and.returnValue({
      getContext: () => ({
        canvas: { width: 300, height: 150 }
      })
    } as unknown as HTMLElement);

    await TestBed.configureTestingModule({
      declarations: [EnergyReportsComponent],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatExpansionModule,
        MatPaginatorModule,
        ReactiveFormsModule,
        MatTableModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: DateAdapter, useClass: NativeDateAdapter },
        { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
        { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
        { provide: NgbModal, useValue: mockModalService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EnergyReportsComponent);
    component = fixture.componentInstance;

    // Explicitly set initial reports to prevent undefined errors
    component.reports = [{
      id: 1,
      startDate: new Date(),
      endDate: new Date(),
      days: 7,
      devices: 5,
      totalProduction: 1000,
      totalConsumption: 800,
      totalDifference: 200,
      timeSeriesData: []
    }];

    // Explicitly select the first report
    component.selectedReport = component.reports[0];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});