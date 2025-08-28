import {
  Component,
  type OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  type WritableSignal,
  computed,
} from '@angular/core'
import type { AlertService } from '../../core/services/alert.service'
import type { AlertViewModel } from '../../core/models/alert-view.model'
import { CommonModule } from '@angular/common'
import { AlertListComponent } from '../alert-list/alert-list'
import { type AlertSeverity, AlertSeverityObject } from './../../core/models/alert.model'
import type { Observable } from 'rxjs'

// Helper function to capitalize the first letter of a string
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

// Create a const array to hold all possible severity values.
// This ensures that if the AlertSeverity type changes, TypeScript will enforce an update here.

const ALL_SEVERITIES: AlertSeverity[] = Object.values(AlertSeverityObject)

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AlertListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  currentAlerts: WritableSignal<AlertViewModel[]> = signal([])
  selectedAlert: AlertViewModel | null = null
  dialogOpen = false
  loading$: Observable<boolean>
  error$: Observable<string | null>
  progress$: Observable<number>

  // Dynamically generate the filters from our typed array
  severityFilters = [
    { label: 'All', value: 'All' },
    ...ALL_SEVERITIES.map((severity) => ({
      label: capitalize(severity),
      value: severity,
    })),
  ]
  selectedSeverity = signal('All')

  filteredAlerts = computed(() => {
    const severity = this.selectedSeverity()
    const alerts = this.currentAlerts()
    if (severity === 'All') {
      return alerts
    }
    return alerts.filter((alert) => alert.errorSeverity === severity)
  })

  constructor(private alertService: AlertService) {
    this.loading$ = this.alertService.loading$
    this.error$ = this.alertService.error$
    this.progress$ = this.alertService.progress$
  }

  ngOnInit(): void {
    this.alertService.getAlerts().subscribe({
      next: (alerts: AlertViewModel[]) => {
        const sortedAlerts = alerts.sort((a, b) => b.errorTime - a.errorTime)
        this.currentAlerts.set(sortedAlerts)
        console.log('Received and sorted alerts:', this.currentAlerts())
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

  onAcknowledge(errorId: string): void {
    this.alertService.acknowledgeAlert(errorId)
  }

  onSeverityFilterChanged(event: CustomEvent<string>): void {
    const selectedLabel = event.detail
    // Find the filter object that matches the selected label
    const selectedFilter = this.severityFilters.find((f) => f.label === selectedLabel)

    if (selectedFilter) {
      // Set the signal to the corresponding 'value'
      this.selectedSeverity.set(selectedFilter.value)
    }
  }

  retry(): void {
    this.alertService.retryLoad()
  }
}
