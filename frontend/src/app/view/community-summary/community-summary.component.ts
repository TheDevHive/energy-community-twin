import { Component } from '@angular/core';

@Component({
  selector: 'app-community-summary',
  templateUrl: './community-summary.component.html',
  styleUrl: './community-summary.component.css'
})
export class CommunitySummaryComponent {
  totalProduction: number = 12500;
  totalConsumption: number = 11000;
  energyBalance: number = 1500;
}
