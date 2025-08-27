import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import type { AlertViewModel } from '../../core/models/alert-view.model'
import { FormatTimestampPipe } from '../../shared/pipes/format-timestamp.pipe'

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [CommonModule, FormatTimestampPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './alert-list.html',
  styleUrls: ['./alert-list.css'],
})
export class AlertListComponent {
  @Input() alerts: AlertViewModel[] = []
  @Output() showDetails = new EventEmitter<AlertViewModel>()
  @Output() acknowledge = new EventEmitter<string>()
}
