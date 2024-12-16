import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponseService } from './api-response.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { WeatherData } from '../models/weather-data';
import { Observable } from 'rxjs/internal/Observable';
import { TimeRange } from '../models/time_range';

@Injectable({
  providedIn: 'root'
})

export class WeatherService {

  private apiUrl = `${environment.API_ENDPOINT}/api/weather`;
  
  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService,
    private auth : AuthService
  ) { }

  getWeatherByDate(localDateTime: Date): Observable<WeatherData> {
    return this.http.get<WeatherData>(`${this.apiUrl}/${localDateTime}`, 
      { headers: this.auth.getHeaders() }
    );
  }

  getWeatherByTimeRange(timeRange: TimeRange): Observable<WeatherData[]> {
    return this.http.post<WeatherData[]>(`${this.apiUrl}/interval`, 
      timeRange,
      { headers: this.auth.getHeaders() }
    );
  }

}
