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

  requestAuthCode(mail: string, isRegister: boolean): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/${isRegister}`, mail, {
      observe: 'body',
    });
  }
  
  tryAuthCode(mail: string, authCode: number, isRegister: boolean): Observable<string> {
    return this.http.post(`${this.apiUrl}/try/${authCode}/${isRegister}`, mail, {
      observe: 'body',
      responseType: 'text'
    });
  }
  
}
