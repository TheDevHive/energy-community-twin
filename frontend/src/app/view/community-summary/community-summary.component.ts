import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-community-summary',
  templateUrl: './community-summary.component.html',
  styleUrls: ['./community-summary.component.css']
})
export class CommunitySummaryComponent implements OnInit {
  @Input() communityName: string = '';
  
  totalProduction: number = 12500;
  totalConsumption: number = 11000;
  energyBalance: number = 1500;
  Math = Math; // Make Math available in the template

  ngOnInit() {
    // Calculate energy balance
    this.energyBalance = this.totalProduction - this.totalConsumption;

    // Ensure we have a default value for community name if none is provided
    if (!this.communityName) {
      this.communityName = 'Community Overview';
    }
  }
}