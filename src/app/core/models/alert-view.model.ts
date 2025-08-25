import { AlertSeverity } from './alert.model'

/**
 * A flattened view model for an alert, designed for the UI.
 * It combines data from a `RawAlert` and its parent `RawContact`,
 * and includes additional properties for managing UI state.
 */
export interface AlertViewModel {
  // From RawAlert
  errorId: string
  errorSeverity: AlertSeverity
  errorCategory: string
  errorMessage: string
  longMessage: string
  errorTime: number // Milliseconds Unix timestamp

  // From RawContact (parent)
  contactName: number
  contactBeginTimestamp: number // Seconds Unix timestamp
  contactEndTimestamp: number // Seconds Unix timestamp
  contactSatellite: string
  contactDetail: string

  // UI state
  acknowledged: boolean
}
