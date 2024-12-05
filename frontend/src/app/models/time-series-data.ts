export interface WeatherData {
    temperature: number; // Celsius
    precipitation: number; // mm
    cloudCover: number; // percentage
    windSpeed: number; // km/h
}

export interface TimeSeriesData {
    date: Date;
    production: number;

    weather: WeatherData;
}