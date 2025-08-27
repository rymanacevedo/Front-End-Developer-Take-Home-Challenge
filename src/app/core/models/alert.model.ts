/*
 * Data Transformation Strategy:
 *
 * The backend provides data as an array of `RawContact` objects, each containing a nested array of `RawAlert` objects.
 * For the UI, a flattened structure (`AlertViewModel`) is more suitable. This model combines properties from both
 * `RawContact` and `RawAlert` into a single, alert-centric object.
 *
 * The transformation process will be handled within a dedicated data service. This service will:
 * 1. Fetch the raw `RawContact[]` data from the `data.json` source.
 * 2. Iterate through each `RawContact`.
 * 3. For each `RawContact`, iterate through its `alerts` array.
 * 4. For each `RawAlert`, create a new `AlertViewModel` object.
 * 5. Map the required properties from the parent `RawContact` (e.g., `contactName`, `contactSatellite`) and the
 *    `RawAlert` itself (e.g., `errorMessage`, `errorSeverity`) to the new `AlertViewModel`.
 * 6. Initialize the `acknowledged` property of the `AlertViewModel` to `false` by default. This property will be
 *    managed by the UI state.
 * 7. Collect all created `AlertViewModel` objects into a single flat array: `AlertViewModel[]`.
 * 8. This flattened array will then be exposed to the rest of the application via an observable, ready for
 *    display and manipulation by the UI components.
 */

/**
 * Represents the severity level of an alert.
 * Based on the unique values observed in `data.json`.
 */
export type AlertSeverity = 'critical' | 'serious' | 'warning' | 'caution' | 'info'

/**
 * Interface for a raw alert object, as received from the data source.
 * This corresponds to an entry in the `alerts` array within a `RawContact`.
 */
export interface RawAlert {
  errorId: string
  errorSeverity: AlertSeverity
  errorCategory: string
  errorMessage: string
  longMessage: string
  errorTime: number // Milliseconds Unix timestamp
  selected: boolean
  new: boolean
  expanded: boolean
}

/**
 * Interface for a raw contact object, as received from the data source.
 * This represents the top-level objects in the `data.json` array.
 */
export interface RawContact {
  _id: string
  contactId: string
  contactStatus: string
  contactName: number
  contactGround: string
  contactSatellite: string
  contactEquipment: string
  contactState: string
  contactStep: string
  contactDetail: string
  contactBeginTimestamp: number // Seconds Unix timestamp
  contactEndTimestamp: number // Seconds Unix timestamp
  contactLatitude: number
  contactLongitude: number
  contactAzimuth: number
  contactElevation: number
  contactResolution: string
  contactResolutionStatus: string
  alerts: RawAlert[]
}


