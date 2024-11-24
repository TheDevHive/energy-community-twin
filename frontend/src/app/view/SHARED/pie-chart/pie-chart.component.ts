import { Component, Input, OnChanges, SimpleChanges, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() production: number = 0;
  @Input() consumption: number = 0;

  private chart: any;
  private borderColor: string = '#fff'; // Default to white for dark theme

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.detectTheme();
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['production'] || changes['consumption']) && this.chart) {
      this.updateChart();
    }
  }

  private detectTheme() {
    const isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Update border color based on the theme
    this.borderColor = isDarkTheme ? '#fff' : '#141414'; // Grey for light theme, white for dark theme

    // Optionally, listen for theme changes dynamically
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      this.borderColor = event.matches ? '#fff' : '#ccc';
      if (this.chart) {
        this.updateChartBorderColor();
      }
    });
  }

  private createChart() {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Energy Production', 'Energy Consumption'],
        datasets: [{
          data: [this.production, this.consumption],
          backgroundColor: [
            '#28a745', // green for production
            '#dc3545'  // red for consumption
          ],
          borderColor: [this.borderColor, this.borderColor],
          borderWidth: 3,
          hoverOffset: 20, // Extra offset when hovering
          offset: [15, 15] // Detach the slices
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 20,       // Adjust box size for legend
              padding: 20,        // Add spacing between legend items
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value.toLocaleString()} Wh`;
              }
            }
          }
        },
        layout: {
          padding: {
            bottom: 0 // Add spacing between the graph and the legend
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true
        }
      }
    });
  }

  private updateChart() {
    if (this.chart) {
      this.chart.data.datasets[0].data = [this.production, this.consumption];
      this.chart.update();
    }
  }

  private updateChartBorderColor() {
    if (this.chart) {
      this.chart.data.datasets[0].borderColor = [this.borderColor, this.borderColor];
      this.chart.update();
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
