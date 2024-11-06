import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  timeout: number = 10000;

  // Alert Page Communities
  alertCommunities = { show: false, type: '', message: '' };
  setAlertCommunities(type: string, message: string) {
    this.alertCommunities = { show: true, type: type, message: message };
    setTimeout(() => {
      this.alertCommunities = { show: false, type: '', message: '' };
    }, this.timeout);
  }
}
