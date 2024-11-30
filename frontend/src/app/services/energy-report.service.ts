import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TimeRange } from '../models/time_range';
import { CommunityService } from './community.service';
import { DeviceService } from './device.service';
import { ApartmentService } from './apartment.service';
import { BuildingService } from './building.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { EnergyReport } from '../models/energy-report';

@Injectable({
  providedIn: 'root'
})
export class EnergyReportService {

  private apiUrl = `${environment.API_ENDPOINT}/api/reports`;

  constructor(
    private communityService: CommunityService,
    private buildingService: BuildingService,
    private apartmentService: ApartmentService,
    private deviceService: DeviceService,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  generateReport(refUUID: string | undefined, simulationData: TimeRange): Observable<boolean> {
    console.log("sono qui: refUUID: " + refUUID + " simulationData: " + simulationData);
    if (!refUUID) {
      return new Observable<boolean>();
    }
    console.log("data inizio: " + simulationData.start + " data fine: " + simulationData.end);
    let uuid = refUUID.substring(1, refUUID.length);
    switch (refUUID.at(0)) {
      case 'A':
        return this.apartmentService.generateMeasurements(uuid, simulationData);
      case 'B':
        return this.buildingService.generateMeasurements(uuid, simulationData);
      case 'C':
        return this.communityService.generateMeasurements(uuid, simulationData);
      case 'D':
        return this.deviceService.generateMeasurements(uuid, simulationData);
      default:
        return new Observable<boolean>();
    }
  }

  deleteReport(reportId: string): Observable<boolean> {
    return this.http.delete<boolean>(
      `${this.apiUrl}/${reportId}`,
      { headers: this.authService.getHeaders() }
    );
  }

  getReports(refUUID: string): Observable<EnergyReport[]> {
    return this.http.get<EnergyReport[]>(
      `${this.apiUrl}/refUUID/${refUUID}`,
      { headers: this.authService.getHeaders() }
    );
  }

}
