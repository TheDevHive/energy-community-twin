import { TimeSeriesData } from './time-series-data';

export interface EnergyReport {
    id: number;
    refUUID: string;
    startDate: Date;
    endDate: Date;
    days: number;
    devices: number;
    totalProduction: number;
    totalConsumption: number;
    totalDifference: number;
    batteryUsage: number;
    batteryEnd: number;
    totalCost: number;

    timeSeriesDataDevice: TimeSeriesData[];
    timeSeriesDataBattery: TimeSeriesData[];
}