import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  timeout: number = 10000;
  timeoutId: any; // Store the reference to the timeout

  // Alert Page Communities
  alertCommunities = { show: false, type: '', message: '' };

  setAlertCommunities(type: string, message: string) {
    // Clear any existing timeout to reset the timer
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Set the new alert and start a new timeout
    this.alertCommunities = { show: true, type: type, message: message };

    // Set the timeout to hide the alert after the specified timeout duration
    this.timeoutId = setTimeout(() => {
      this.alertCommunities = { show: false, type: '', message: '' };
    }, this.timeout);
  }

  // Alert Page Buildings
  alertBuildings = { show: false, type: '', message: '' };

  setAlertBuildings(type: string, message: string) {
    // Clear any existing timeout to reset the timer
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Set the new alert and start a new timeout
    this.alertBuildings = { show: true, type: type, message: message };

    // Set the timeout to hide the alert after the specified timeout duration
    this.timeoutId = setTimeout(() => {
      this.alertBuildings = { show: false, type: '', message: '' };
    }, this.timeout);
  }

  // Alert Page Apartments
  alertApartments = { show: false, type: '', message: '' };

  setAlertApartments(type: string, message: string) {
    // Clear any existing timeout to reset the timer
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Set the new alert and start a new timeout
    this.alertApartments = { show: true, type: type, message: message };

    // Set the timeout to hide the alert after the specified timeout duration
    this.timeoutId = setTimeout(() => {
      this.alertApartments = { show: false, type: '', message: '' };
    }, this.timeout);
  }
  
}
