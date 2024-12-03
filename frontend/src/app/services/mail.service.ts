import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponseService } from './api-response.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ResponseEntity } from '../models/response-entity';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  private apiUrl = `${environment.API_ENDPOINT}/api/auth`;
  
  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService,
    private auth : AuthService
  ) { }

  requestAuthCode(mail: string): Observable<boolean> {
    return this.apiResponseService.extractBody(
      this.http.post<ResponseEntity<boolean>>(`${this.apiUrl}`, mail, {
        observe: 'response', // Mantiene l'osservazione della risposta
      })
    );
  }
  
  tryAuthCode(mail: string, authCode: number): Observable<string> {
    return this.apiResponseService.extractBody(
      this.http.post<ResponseEntity<string>>(`${this.apiUrl}/try/${authCode}`, mail, {
        observe: 'response', // Mantiene l'osservazione della risposta
      })
    );
  }  
  
}
