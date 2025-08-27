import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import {
  BehaviorSubject,
  type Observable,
  map,
  catchError,
  of,
  tap,
  timer,
  takeWhile,
  finalize,
  delay,
} from 'rxjs'
import type { AlertViewModel } from '../models/alert-view.model'
import type { RawContact } from '../models/alert.model'

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private dataUrl = 'assets/data.json'
  private localStorageKey = 'acknowledgedAlerts'

  private alerts = new BehaviorSubject<AlertViewModel[]>([])
  alerts$: Observable<AlertViewModel[]> = this.alerts.asObservable()

  private loading = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean> = this.loading.asObservable()

  private progress = new BehaviorSubject<number>(0)
  progress$: Observable<number> = this.progress.asObservable()

  private error = new BehaviorSubject<string | null>(null)
  error$: Observable<string | null> = this.error.asObservable()

  constructor(private http: HttpClient) {
    this.loadInitialData()
  }

  private loadInitialData(): void {
    this.loading.next(true)
    this.error.next(null)
    this.progress.next(0)

    timer(0, 30)
      .pipe(
        takeWhile((val) => val <= 100),
        tap((val) => this.progress.next(val)),
        finalize(() => {
          this.http
            .get<RawContact[]>(this.dataUrl)
            .pipe(
              delay(1000),
              map((contacts) => {
                const acknowledgedIds = this.getAcknowledgedIds()
                return contacts.flatMap((contact) =>
                  contact.alerts.map((alert) => ({
                    ...alert,
                    contactName: contact.contactName,
                    contactBeginTimestamp: contact.contactBeginTimestamp,
                    contactEndTimestamp: contact.contactEndTimestamp,
                    contactSatellite: contact.contactSatellite,
                    contactDetail: contact.contactDetail,
                    acknowledged: acknowledgedIds.includes(alert.errorId),
                  })),
                )
              }),
              tap(() => this.loading.next(false)),
              catchError((err) => {
                this.error.next('Failed to load alerts data.')
                this.loading.next(false)
                console.error(err)
                return of([])
              }),
            )
            .subscribe((alerts) => this.alerts.next(alerts))
        }),
      )
      .subscribe()
  }

  getAlerts(): Observable<AlertViewModel[]> {
    return this.alerts$
  }

  acknowledgeAlert(errorId: string): void {
    const acknowledgedIds = this.getAcknowledgedIds()
    if (!acknowledgedIds.includes(errorId)) {
      acknowledgedIds.push(errorId)
      localStorage.setItem(this.localStorageKey, JSON.stringify(acknowledgedIds))

      const currentAlerts = this.alerts.getValue()
      const updatedAlerts = currentAlerts.map((alert) =>
        alert.errorId === errorId ? { ...alert, acknowledged: true } : alert,
      )
      this.alerts.next(updatedAlerts)
    }
  }

  private getAcknowledgedIds(): string[] {
    const storedIds = localStorage.getItem(this.localStorageKey)
    return storedIds ? JSON.parse(storedIds) : []
  }
}
