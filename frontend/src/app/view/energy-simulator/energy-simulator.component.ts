import { Component, Input, OnInit, ElementRef, ViewChild, AfterViewInit, EventEmitter, Output, HostListener } from '@angular/core';
import * as d3 from 'd3';
import { EnergyCurve } from '../../models/energy_curve';
import { DeviceService } from '../../services/device.service';
import { AlertService } from '../../services/alert.service';

interface EnergyData {
  hour: string;
  value: number;
}

@Component({
  selector: 'app-energy-simulator',
  templateUrl: './energy-simulator.component.html',
  styleUrls: ['./energy-simulator.component.css']
})
export class EnergySimulatorComponent implements OnInit, AfterViewInit {
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @Input() deviceUuid?: String;
  @Input() type?: "Production" | "Consumption";
  @Output() patternSaved = new EventEmitter<number[]>();

  data: EnergyData[] = [];
  energyScales = [
    { value: 100, label: '100 W' },
    { value: 500, label: '500 W' },
    { value: 1000, label: '1 KW' },
    { value: 5000, label: '5 KW' },
    { value: 10000, label: '10 KW' }
  ];
  selectedScale = this.energyScales[0].value;

  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private width: number;
  private height: number;
  private readonly aspectRatio = 2; // width:height ratio
  private readonly minWidth = 300;
  private readonly maxWidth = 900;
  private readonly margin = { top: 20, right: 30, bottom: 50, left: 60 };
  private line: d3.Line<EnergyData>;
  private xScale: d3.ScaleLinear<number, number>;
  private yScale: d3.ScaleLinear<number, number>;

  constructor(
    private deviceService: DeviceService,
    private alert: AlertService
  ) {
    // Initialize data with 24 hours
    this.data = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      value: 50
    }));

    // Initialize svg with a temporary empty selection
    this.svg = d3.select(null as unknown as SVGSVGElement);

    // Initialize scales and line
    this.xScale = d3.scaleLinear();
    this.yScale = d3.scaleLinear();
    this.line = d3.line<EnergyData>();

    // Initialize dimensions
    this.width = this.maxWidth;
    this.height = this.width / this.aspectRatio;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateDimensions();
    this.createChart();
  }

  private updateDimensions(): void {
    // Get the container width
    const containerWidth = this.chartContainer?.nativeElement.offsetWidth;
    if (!containerWidth) return;

    // Set width based on container size, with min/max limits
    this.width = Math.min(Math.max(containerWidth, this.minWidth), this.maxWidth);
    this.height = this.width / this.aspectRatio;
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.updateDimensions();
    this.createChart();
  }

  setEnergyData(data: EnergyData[]): void {
    this.data = data;
    if (this.svg) {
      this.updateChart();
    }
  }

  onScaleChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedScale = Number(target.value);
    const middleValue = this.selectedScale / 2;
    this.data = this.data.map(d => ({
      ...d,
      value: middleValue
    }));
    this.updateChart();
  }

  createChart(): void {
    // Clear any existing SVG
    d3.select(this.chartContainer.nativeElement).select('svg').remove();

    // Create SVG with responsive dimensions
    this.svg = d3.select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Initialize scales
    const innerWidth = this.width - this.margin.left - this.margin.right;
    const innerHeight = this.height - this.margin.top - this.margin.bottom;

    this.xScale = d3.scaleLinear()
      .domain([0, 23])
      .range([0, innerWidth]);

    this.yScale = d3.scaleLinear()
      .domain([0, this.selectedScale])
      .range([innerHeight, 0]);

    // Initialize line generator
    this.line = d3.line<EnergyData>()
      .x(d => this.xScale(parseInt(d.hour)))
      .y(d => this.yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Add touch and mouse events
    const svg = this.svg.node();
    if (svg) {
      svg.addEventListener('touchstart', (e) => e.preventDefault());
      svg.addEventListener('touchmove', (e) => this.handleTouch(e));
    }

    this.svg
      .on('mousemove', (event) => this.handleMouseMove(event))
      .on('mousedown', () => this.svg.style('cursor', 'grabbing'))
      .on('mouseup', () => this.svg.style('cursor', 'default'));

    this.updateChart();
  }

  handleTouch(event: TouchEvent): void {
    event.preventDefault();
    if (event.touches.length !== 1) return;

    const touch = event.touches[0];
    const svg = this.svg.node();
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = touch.clientX - rect.left - this.margin.left;
    const y = touch.clientY - rect.top - this.margin.top;

    this.updateValueAtPosition(x, y);
  }

  handleMouseMove(event: MouseEvent): void {
    if (event.buttons !== 1) return;

    const coords = d3.pointer(event, this.svg.node());
    const x = coords[0] - this.margin.left;
    const y = coords[1] - this.margin.top;

    this.updateValueAtPosition(x, y);
  }

  private updateValueAtPosition(x: number, y: number): void {
    const hour = Math.round(this.xScale.invert(x));
    
    if (hour >= 0 && hour < 24) {
      const value = Math.max(0, Math.min(this.selectedScale,
        this.yScale.invert(y)
      ));

      this.data[hour].value = Math.round(value);
      this.updateChart();
    }
  }

  updateChart(): void {
    const innerWidth = this.width - this.margin.left - this.margin.right;
    const innerHeight = this.height - this.margin.top - this.margin.bottom;

    // Clear previous content
    this.svg.selectAll('*').remove();

    // Create chart group
    const g = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3.axisBottom(this.xScale)
          .tickSize(-innerHeight)
          .tickFormat(() => '')
          .tickValues(d3.range(0, 24, window.innerWidth < 768 ? 4 : 2)) // Reduce ticks on mobile
      );

    g.append('g')
      .attr('class', 'grid')
      .call(
        d3.axisLeft(this.yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
          .ticks(window.innerWidth < 768 ? 5 : 10) // Reduce ticks on mobile
      );

    // Add axes with responsive ticks
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3.axisBottom(this.xScale)
          .tickFormat(d => `${d}:00`)
          .tickValues(d3.range(0, 24, window.innerWidth < 768 ? 4 : 2))
      );

    g.append('g')
      .attr('class', 'y-axis')
      .call(
        d3.axisLeft(this.yScale)
          .ticks(window.innerWidth < 768 ? 5 : 10)
      );

    // Determine color
    const lineColor = this.type === "Consumption" ? '#dc3545' : '#28a745';

    // Add line
    g.append('path')
      .datum(this.data)
      .attr('class', 'line')
      .attr('d', this.line)
      .attr('fill', 'none')
      .attr('stroke', lineColor)
      .attr('stroke-width', 2);

    // Add dots with responsive sizes
    const dotRadius = window.innerWidth < 768 ? 3 : 4;
    g.selectAll('.dot')
      .data(this.data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => this.xScale(parseInt(d.hour)))
      .attr('cy', d => this.yScale(d.value))
      .attr('r', dotRadius)
      .attr('fill', lineColor);

    // Add responsive labels
    if (window.innerWidth >= 768) {
      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - this.margin.left)
        .attr('x', 0 - (innerHeight / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text(`Energy ${this.type} (W)`);

      g.append('text')
        .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + 40})`)
        .style('text-anchor', 'middle')
        .text('Hour of Day');
    }
  }

  savePattern(): void {
    if (!this.deviceUuid) {
      console.error('No deviceUuid ID provided');
      return;
    }

    const pattern: EnergyCurve = {
      energyCurve: this.data.map(d => d.value)
    };

    this.deviceService.saveEnergyPattern(this.deviceUuid, pattern).subscribe({
      next: (savedPattern) => {
        this.patternSaved.emit(this.data.map((d) => d.value));
        console.log('Pattern saved successfully', savedPattern);
        // You could emit an event here to notify parent components
      },
      error: (error) => {
        console.error('Error saving pattern:', error);
        // Handle error (maybe show a notification)
      }
    });
  }

  resetPattern(): void {
    this.data = this.data.map(d => ({
      ...d,
      value: 50
    }));
    this.updateChart();
    // se a yellow warning message saying that the reset must be confirmed by saving
    this.alert.setAlertDevice('warning', 'The curve has been reset. Changes will be lost if not saved.');
  }
}
