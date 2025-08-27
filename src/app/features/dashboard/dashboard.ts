import { Component, type OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { AlertService } from '../../core/services/alert.service'
import type { AlertViewModel } from '../../core/models/alert-view.model'
import { CommonModule } from '@angular/common'
import { AlertListComponent } from '../alert-list/alert-list'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AlertListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  currentAlerts: AlertViewModel[] = []
  selectedAlert: AlertViewModel | null = null
  dialogOpen = false

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.alertService.getAlerts().subscribe({
      next: (alerts: AlertViewModel[]) => {
        this.currentAlerts = alerts.sort((a, b) => b.errorTime - a.errorTime)
        console.log('Received and sorted alerts:', this.currentAlerts)
      },
      error: (err) => {
        console.error('Error fetching alerts:', err)
      },
    })
  }

  onShowDetails(alert: AlertViewModel): void {
    this.selectedAlert = alert
    this.dialogOpen = true
  }

  onDialogClosed(): void {
    this.dialogOpen = false
    this.selectedAlert = null
  }
}
