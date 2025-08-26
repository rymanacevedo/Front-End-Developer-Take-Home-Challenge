import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AlertService } from '../../core/services/alert.service';
import { AlertViewModel } from '../../core/models/alert-view.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.alertService.getAlerts().subscribe({
      next: (alerts: AlertViewModel[]) => {
        console.log('Received Alerts:', alerts);
      },
      error: (err) => {
        console.error('Error fetching alerts:', err);
      },
    });
  }
}
