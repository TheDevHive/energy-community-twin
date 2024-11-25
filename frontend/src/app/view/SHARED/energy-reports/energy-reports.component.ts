// energy-reports.component.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';


// This is important! Register Chart.js components
Chart.register(...registerables);

interface EnergyReport {
  id: number;
  startDate: Date;
  endDate: Date;
  days: number;
  devices: number;
}

interface TimeSeriesData {
  date: Date;
  production: number;
}

@Component({
  selector: 'app-energy-reports',
  templateUrl: './energy-reports.component.html',
  styleUrls: ['./energy-reports.component.scss']
})
export class EnergyReportsComponent implements OnInit, AfterViewInit {
  @ViewChild('timeSeriesChart') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Table configuration
  displayedColumns: string[] = ['startDate', 'endDate', 'days', 'devices', 'actions'];
  dataSource: MatTableDataSource<EnergyReport>;
  
  // Chart configuration
  timeSeriesChart: any;

  // Date range form controls
  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  
  // Sample data - replace with actual data service
  reports: EnergyReport[] = [
    {
      id: 1,
      startDate: new Date('2024-11-20'),
      endDate: new Date('2024-01-07'),
      days: 7,
      devices: 12
    },
    {
      id: 2,
      startDate: new Date('2024-01-08'),
      endDate: new Date('2024-01-14'),
      days: 7,
      devices: 15
    },
    {
      id: 3,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-21'),
      days: 2,
      devices: 10
    },
    {
      id: 4,
      startDate: new Date('2024-01-22'),
      endDate: new Date('2024-01-28'),
      days: 7,
      devices: 8
    },
    {
      id: 5,
      startDate: new Date('2024-01-29'),
      endDate: new Date('2024-02-04'),
      days: 7,
      devices: 2
    },
    {
      id: 6,
      startDate: new Date('2024-02-05'),
      endDate: new Date('2024-02-11'),
      days: 7,
      devices: 5
    }
  ];

  timeSeriesData: TimeSeriesData[] = [
    { date: new Date('2024-11-20'), production: 100 },
    { date: new Date('2024-11-11'), production: 150 },
    { date: new Date('2024-11-23'), production: -50 },
    { date: new Date('2024-11-24'), production: 100 },
    { date: new Date('2024-11-25'), production: 180 },
    { date: new Date('2024-04-06'), production: -80 },
    { date: new Date('2024-02-07'), production: 120 },
  ];

  constructor() {
    this.dataSource = new MatTableDataSource(this.reports);

    // Initialize with last week selected
    this.setLastWeek();

    // Subscribe to date range changes
    this.dateRange.valueChanges.subscribe(() => {
      this.updateChartData();
    });
  }

  ngOnInit() {
    this.initializeChart();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

   // Quick select functions
   setLastWeek() {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);
    this.dateRange.patchValue({
      start: start,
      end: end
    });
  }

  setLastMonth() {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    this.dateRange.patchValue({
      start: start,
      end: end
    });
  }

  setLastYear() {
    const end = new Date();
    const start = new Date();
    start.setFullYear(end.getFullYear() - 1);
    this.dateRange.patchValue({
      start: start,
      end: end
    });
  }

  initializeChart() {
    const ctx = document.getElementById('timeSeriesChart') as HTMLCanvasElement;
    const chartConfig: ChartConfiguration = {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Energy Production (W)',
          data: [],
          borderColor: '#3498db',
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
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        },
      }
    };
    
    this.timeSeriesChart = new Chart(ctx, chartConfig);
    this.updateChartData();
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
    if (totalDays <= 7) {
      tickInterval = 1; // Daily ticks for week or less
    } else if (totalDays <= 31) {
      tickInterval = 3; // Every 3 days for month
    } else {
      // For longer periods, use monthly ticks
      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      return dates;
    }

    // Generate ticks for daily/3-day intervals
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + tickInterval);
    }
    return dates;
  }

  updateChartData() {
    const startDate = this.dateRange.get('start')?.value;
    const endDate = this.dateRange.get('end')?.value;

    if (!startDate || !endDate) return;

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Choose date formatter based on range
    let dateFormatter: Intl.DateTimeFormat;
    if (totalDays <= 31) {
      dateFormatter = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } else {
      dateFormatter = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        year: 'numeric'
      });
    }

    // Get data within the selected range
    let filteredData = [...this.timeSeriesData]
      .filter(d => {
        const date = new Date(d.date);
        return date >= startDate && date <= endDate;
      })
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

  onDetails(report: EnergyReport) {
    console.log('View details for report:', report);
  }

  onDownload(report: EnergyReport) {
    console.log('Download report:', report);
  }

  onDelete(report: EnergyReport) {
    console.log('Delete report:', report);
  }
}