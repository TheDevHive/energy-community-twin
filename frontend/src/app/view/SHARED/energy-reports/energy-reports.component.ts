// energy-reports.component.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddSimulationComponent } from '../add-simulation/add-simulation.component';

import { EnergyReport } from '../../../models/energy-report';
import { TimeSeriesData } from '../../../models/time-series-data';
import { EnergyReportService } from '../../../services/energy-report.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AlertService } from '../../../services/alert.service';


// This is important! Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-energy-reports',
  templateUrl: './energy-reports.component.html',
  styleUrls: ['./energy-reports.component.css']
})
export class EnergyReportsComponent implements OnInit, AfterViewInit {
  @ViewChild('timeSeriesChart') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Table configuration
  displayedColumns: string[] = ['id', 'startDate', 'endDate', 'days', 'devices', 'totalProduction', 'totalConsumption', 'totalDifference', 'actions'];
  dataSource: MatTableDataSource<EnergyReport> = new MatTableDataSource<EnergyReport>();

  // Chart configuration
  timeSeriesChart: any;

  // Date range form controls
  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  loading = true;

  reports: EnergyReport[] = [];
  @Input() refUUID: string = '';

  selectedReport: EnergyReport = {
    id: 0,
    refUUID: '',
    startDate: new Date(),
    endDate: new Date(),
    days: 0,
    devices: 0,
    totalProduction: 0,
    totalConsumption: 0,
    totalDifference: 0,
    timeSeriesData: []
  };

  public isDarkMode = false;

  constructor(
    private modalService: NgbModal,
    private reportService: EnergyReportService,
    private alertService: AlertService
  ) {
    // Check initial dark mode preference
    this.checkDarkModePreference();

    // Listen for dark mode changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.checkDarkModePreference.bind(this));
  }

  private checkDarkModePreference() {
    this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (this.timeSeriesChart) {
      this.updateChartTheme();
    }
  }

  ngOnInit() {
    console.log('refUUID: ' + this.refUUID);
    this.alertService.clearAlertNewSimulation();
    this.selectLastReport();
  }

  // Modify selectLastReport() to handle chart updates
selectLastReport() {
  // Check if reports are already loaded
  if (this.reports.length === 0) {
    // If no reports, load them first
    this.reportService.getReports(this.refUUID).subscribe({
      next: (reports) => {
        this.reports = reports;

        // Update data source after loading
        this.dataSource = new MatTableDataSource(this.reports);

        // Sort and select the last report after loading
        this.reports.sort((a, b) => b.id - a.id);

        // Select the last report if available
        if (this.reports.length > 0) {
          this.selectedReport = this.reports[0];
          // Update the date range and chart after selecting new report
          this.setReportDateRange(this.selectedReport);
          
          // Initialize or update chart based on whether it exists
          if (this.timeSeriesChart) {
            this.updateChartData();
          } else {
            this.initializeChart();
          }
        }
      },
      error: (error) => {
        console.error('Error loading reports:', error);
        this.reports = [];
      }
    });
  } else {
    // If reports are already loaded, just sort and select
    this.reports.sort((a, b) => b.id - a.id);

    if (this.reports.length > 0) {
      this.selectedReport = this.reports[0];
      // Update the date range and chart for existing reports
      this.setReportDateRange(this.selectedReport);
      if (this.timeSeriesChart) {
        this.updateChartData();
      }
    }
  }
}

startNewSimulation() {
  const modalRef = this.modalService.open(AddSimulationComponent, {
    centered: true,
    backdrop: 'static',
    windowClass: 'building-modal',
  });

  modalRef.componentInstance.refUUID = this.refUUID;

  modalRef.result.then(
    (result) => {
      if (result) {
        console.log('Simulation data:', result);

        // Fetch new reports and update the UI
        this.reportService.getReports(this.refUUID).subscribe({
          next: (reports) => {
            this.reports = reports;
            this.updateDataSource();
            this.selectLastReport();

            if (this.reports.length === 1)
              this.initializeChart();
            
            // Notify user about the new simulation
            this.alertService.setAlertNewSimulation(
              'success',
              'Simulation added successfully!'
            );
          },
          error: (error) => {
            console.error('Error reloading reports:', error);

            // Notify user about the error
            this.alertService.setAlertNewSimulation(
              'danger',
              'Failed to start the simulation. Please try again.'
            );
          }
        });
      }
    },
    (reason) => {
      console.log('Modal dismissed:', reason);
    }
  );
}

  // Modify updateDataSource() to ensure chart updates
  private updateDataSource() {
    if (this.dataSource && this.reports.length > 0) {
      // Reorder reports by ID in descending order
      this.reports.sort((a, b) => b.id - a.id);

      this.dataSource.data = this.reports;

      // Re-apply paginator and sort after updating data
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }

      // Update the chart when data source is updated
      if (this.timeSeriesChart) {
        this.setReportDateRange(this.reports[0]);
        this.updateChartData();
      }
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    setTimeout(() => {
      this.setReportDateRange(this.selectedReport);

      this.initializeChart();
      this.updateChartData();

      // Subscribe to date range changes
      this.dateRange.valueChanges.subscribe(() => {
        this.updateChartData();
      });
      this.updateDataSource();

    });
  }

  private setReportDateRange(report: EnergyReport) {
    // Ensure the start and end dates are exactly from the report
    this.dateRange.patchValue({
      start: report.startDate,
      end: report.endDate
    });
  }

  initializeChart() {
    
    const ctx = document.getElementById('timeSeriesChart') as HTMLCanvasElement;
  
    // Add null check
    if (!ctx) {
      console.error('Chart canvas element not found');
      this.retryChartInitialization();
      return;
    }

    const chartConfig: ChartConfiguration = {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Energy Production (W)',
          data: [],
          borderColor: this.isDarkMode ? '#3498db' : '#2980b9',
          tension: 0.1,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Energy Production (W)'
            },
            grid: {
              color: this.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
            },
            ticks: {
              color: this.isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45,
              color: this.isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
            },
            grid: {
              color: this.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
            }
          }
        },
        plugins: {
          legend: {
            display: false,
            labels: {
              color: this.isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
            }
          }
        },
        backgroundColor: this.isDarkMode ? 'rgba(20,20,20,0.9)' : 'rgba(255,255,255,0.9)'
      }
    };

    this.timeSeriesChart = new Chart(ctx, chartConfig);
    this.updateChartData();
  }

  private retryChartInitialization(attempts: number = 3) {
    console.log('Retry initialization attempts:', attempts);
    if (attempts <= 0) {
      console.error('Failed to initialize chart after multiple attempts');
      return;
    }
  
    // Wait a short time before retrying
    setTimeout(() => {
      try {
        // Attempt to find the canvas again
        const retryCtx = document.getElementById('timeSeriesChart') as HTMLCanvasElement;
        
        if (retryCtx) {
          this.setReportDateRange(this.selectedReport);
          this.initializeChart();
        } else {
          // If canvas still not found, retry with fewer attempts
          this.retryChartInitialization(attempts - 1);
        }
      } catch (retryError) {
        console.error('Retry initialization error:', retryError);
        this.retryChartInitialization(attempts - 1);
      }
    }, 500); // 500ms delay between attempts
  }

  updateChartData() {
    const startDateValue = this.dateRange.get('start')?.value;
    const originalEndDateValue = this.dateRange.get('end')?.value;

    // Convert to Date object if it's not already one
    const startDate = startDateValue instanceof Date
      ? startDateValue
      : startDateValue
        ? new Date(startDateValue)
        : null;

    const endDate = originalEndDateValue instanceof Date
      ? originalEndDateValue
      : originalEndDateValue
        ? new Date(originalEndDateValue)
        : null;

    if (!startDate || !endDate) {
      console.warn('Invalid date range');
      return;
    }

    // Ensure end date is set to the end of the day
    endDate.setHours(23, 59, 59, 999);

    // Precise single day check
    const isSingleDay =
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getDate() === endDate.getDate();

    if (isSingleDay) {
      // Single day logic
      const ticks = this.generateHourlyTicks(startDate);

      // Filter and map data for the specific day
      const filteredData = this.selectedReport.timeSeriesData
        .filter(d => {
          // Ensure date is converted to a proper Date object
          const date = d.date instanceof Date
            ? d.date
            : typeof d.date === 'string'
              ? new Date(d.date)
              : null;

          return date && date >= startDate && date <= endDate;
        })
        .map(d => ({
          ...d,
          date: d.date instanceof Date
            ? d.date
            : new Date(d.date)
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      const hourlyFormatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      });

      // Create data points for all 2-hour intervals
      const chartData = ticks.map(tickDate => {
        // Find production data closest to each 2-hour tick
        const matchingData = filteredData.reduce((closest, current) => {
          const currentDate = new Date(current.date);
          const closestDate = new Date(closest.date);
          const tickTime = tickDate.getTime();
          const currentTime = currentDate.getTime();
          const closestTime = closestDate.getTime();

          // Find the data point closest to the current 2-hour tick
          return Math.abs(currentTime - tickTime) < Math.abs(closestTime - tickTime)
            ? current
            : closest;
        }, filteredData[0] || { date: tickDate, production: 0 });

        return {
          date: tickDate,
          production: matchingData?.production || 0
        };
      });

      // Update chart
      if (this.timeSeriesChart) {
        this.timeSeriesChart.data.labels = chartData.map(d => hourlyFormatter.format(d.date));
        this.timeSeriesChart.data.datasets[0].data = chartData.map(d => d.production);

        // Customize x-axis for hourly view
        this.timeSeriesChart.options.scales.x.ticks.maxTicksLimit = 12;

        this.timeSeriesChart.update('none');
      }
    } else {
      // Multi-day logic
      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      let dateFormatter: Intl.DateTimeFormat;
      if (totalDays <= 31) {
        dateFormatter = new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      } else {
        dateFormatter = new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }

      // Filter data within the date range
      let filteredData = this.selectedReport.timeSeriesData
        .filter(d => {
          // Ensure date is converted to a proper Date object
          const date = d.date instanceof Date
            ? d.date
            : typeof d.date === 'string'
              ? new Date(d.date)
              : null;

          return date && date >= startDate && date <= endDate;
        })
        .map(d => ({
          ...d,
          date: d.date instanceof Date
            ? d.date
            : new Date(d.date)
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      // Aggregate data if range is more than 31 days
      if (totalDays > 31) {
        filteredData = this.aggregateDataByMonth(filteredData);
      }

      // Generate regular tick marks
      const ticks = this.generateDateTicks(startDate, endDate);

      // Create data points for all ticks, using 0 for missing data
      const chartData = ticks.map(tickDate => {
        const matchingData = filteredData.find(d => {
          const dataDate = new Date(d.date);
          if (totalDays > 31) {
            return dataDate.getMonth() === tickDate.getMonth() &&
              dataDate.getFullYear() === tickDate.getFullYear();
          } else {
            return dataDate.toDateString() === tickDate.toDateString();
          }
        });
        return {
          date: tickDate,
          production: matchingData?.production || 0
        };
      });

      // Update chart
      if (this.timeSeriesChart) {
        this.timeSeriesChart.data.labels = chartData.map(d => dateFormatter.format(d.date));
        this.timeSeriesChart.data.datasets[0].data = chartData.map(d => d.production);

        // Update tick settings based on data range
        this.timeSeriesChart.options.scales.x.ticks.maxTicksLimit =
          totalDays > 7 && totalDays <= 31 ? 10 : undefined;

        this.timeSeriesChart.update('none');
      }
    }
  }

  private updateChartTheme() {
    if (!this.timeSeriesChart) return;

    // Update chart colors for dark/light mode
    this.timeSeriesChart.data.datasets[0].borderColor = this.isDarkMode ? '#3498db' : '#2980b9';

    this.timeSeriesChart.options.scales.y.grid.color = this.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    this.timeSeriesChart.options.scales.y.ticks.color = this.isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)';

    this.timeSeriesChart.options.scales.x.grid.color = this.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    this.timeSeriesChart.options.scales.x.ticks.color = this.isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)';

    this.timeSeriesChart.options.plugins.legend.labels.color = this.isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)';

    this.timeSeriesChart.options.backgroundColor = this.isDarkMode ? 'rgba(20,20,20,0.9)' : 'rgba(255,255,255,0.9)';

    this.timeSeriesChart.update('none');
  }

  private aggregateDataByMonth(data: TimeSeriesData[]): TimeSeriesData[] {
    const monthlyData = new Map<string, number>();

    data.forEach(item => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const currentSum = monthlyData.get(monthKey) || 0;
      monthlyData.set(monthKey, currentSum + item.production);
    });

    return Array.from(monthlyData.entries()).map(([monthKey, sum]) => {
      const [year, month] = monthKey.split('-').map(Number);
      return {
        date: new Date(year, month - 1, 1),
        production: sum
      };
    });
  }

  private generateDateTicks(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    // Determine appropriate tick interval based on date range
    let tickInterval: number;
    if (totalDays <= 30) {
      tickInterval = 1; // Daily ticks for month or less
    } else {
      // Calculate tick interval based on division of total days
      tickInterval = Math.ceil(totalDays / 30);
    }

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + tickInterval);
    }
    return dates;
  }

  private generateHourlyTicks(date: Date): Date[] {
    const ticks: Date[] = [];
    const baseDate = new Date(date);
    baseDate.setHours(0, 0, 0, 0); // Start of the day
  
    for (let hour = 0; hour < 24; hour += 2) {
      const tickDate = new Date(baseDate);
      tickDate.setHours(hour);
      ticks.push(tickDate);
    }
  
    // Add the last tick at 23:59
    const lastTickDate = new Date(baseDate);
    lastTickDate.setHours(23, 59, 0, 0);
    ticks.push(lastTickDate);
  
    return ticks;
  }

  onDetails(report: EnergyReport) {
    this.selectedReport = report;

    // Update date range to match the selected report
    this.setReportDateRange(report);
    this.updateChartData();

    // Scroll to the main div if the element exists
    const mainDiv = document.querySelector('.accordion-section');
    if (mainDiv) {
      mainDiv.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onDownload(report: EnergyReport) {
    console.log('Download report:', report);
  }

  onDelete(report: EnergyReport) {
    console.log('Delete report:', report);
    // Open confirmation modal before deleting
    const modalRef = this.modalService.open(ConfirmationDialogComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'confirmation-modal',
    });

    modalRef.componentInstance.message = 'Are you sure you want to delete this report?';
    modalRef.componentInstance.title = 'Delete Report';
    modalRef.componentInstance.color = 'red';

    modalRef.result.then(
      (result) => {
      if (result === true) {
        this.reportService.deleteReport(report.id.toString()).subscribe(
        () => {
          this.reports = this.reports.filter(r => r.id !== report.id);
          this.updateDataSource();

          this.alertService.setAlertNewSimulation(
            'success',
            'Simulation deleted successfully!'
          );
        },
        (error) => {
          console.error('Error deleting report:', error);
        }
        );
      }
      },
      (reason) => {
      // Modal dismissed
      }
    );
  }

  energyDifferenceIcon(report: EnergyReport): string {
    if (report.totalDifference > 0) {
      return 'bi-arrow-up-right text-success';
    } else if (report.totalDifference < 0) {
      return 'bi-arrow-down-right text-danger';
    } else {
      return 'bi-arrow-right text-info';
    }
  }
}