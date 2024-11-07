import { Component, Input } from '@angular/core';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {

  constructor(public alert:AlertService) { }

  @Input() page!: string;
}
