import { TimeSeriesData } from './time-series-data';

export interface EnergyReport {
    id: number;
    startDate: Date;
    endDate: Date;
    days: number;
    devices: number;
    totalProduction: number;
    totalConsumption: number;
    totalDifference: number;

    timeSeriesData: TimeSeriesData[];
}