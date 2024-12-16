import { WeatherData } from "./weather-data";

export interface TimeSeriesData {
    date: Date;
    production: number;

    weather: WeatherData;
}