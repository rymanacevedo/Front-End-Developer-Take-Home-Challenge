import { Component, type OnInit, CUSTOM_ELEMENTS_SCHEMA, signal, WritableSignal, computed } from '@angular/core';
import { AlertService } from '../../core/services/alert.service';
import type { AlertViewModel } from '../../core/models/alert-view.model';
import { CommonModule } from '@angular/common';
import { AlertListComponent } from '../alert-list/alert-list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AlertListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  currentAlerts: WritableSignal<AlertViewModel[]> = signal([]);
  selectedAlert: AlertViewModel | null = null;
  dialogOpen = false;

  severityFilters = [
    { label: 'All', value: 'All' },
    { label: 'Critical', value: 'Critical' },
    { label: 'Warning', value: 'Warning' },
    { label: 'Info', value: 'Info' },
  ];
  selectedSeverity = signal('All');

  filteredAlerts = computed(() => {
    const severity = this.selectedSeverity();
    const alerts = this.currentAlerts();
    if (severity === 'All') {
      return alerts;
    }
    return alerts.filter((alert) => alert.errorSeverity === severity);
  });

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.alertService.getAlerts().subscribe({
      next: (alerts: AlertViewModel[]) => {
        const sortedAlerts = alerts.sort((a, b) => b.errorTime - a.errorTime);
        this.currentAlerts.set(sortedAlerts);
        console.log('Received and sorted alerts:', this.currentAlerts());
      },
      error: (err) => {
        console.error('Error fetching alerts:', err);
      },
    });
  }

  onShowDetails(alert: AlertViewModel): void {
    this.selectedAlert = alert;
    this.dialogOpen = true;
  }

  onDialogClosed(): void {
    this.dialogOpen = false;
    this.selectedAlert = null;
  }

  onAcknowledge(errorId: string): void {
    this.alertService.acknowledgeAlert(errorId);
  }

  onSeverityFilterChanged(event: CustomEvent<any>): void {
    const selectedFilter = event.detail;
    this.selectedSeverity.set(selectedFilter);
  }
}
