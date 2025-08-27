import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, type Observable, map } from 'rxjs';
import type { AlertViewModel } from '../models/alert-view.model';
import type { RawContact } from '../models/alert.model';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private dataUrl = 'assets/data.json';
  private localStorageKey = 'acknowledgedAlerts';

  private alerts = new BehaviorSubject<AlertViewModel[]>([]);
  alerts$: Observable<AlertViewModel[]> = this.alerts.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.http
      .get<RawContact[]>(this.dataUrl)
      .pipe(
        map((contacts) => {
          const acknowledgedIds = this.getAcknowledgedIds();
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
          );
        }),
      )
      .subscribe((alerts) => this.alerts.next(alerts));
  }

  getAlerts(): Observable<AlertViewModel[]> {
    return this.alerts$;
  }

  acknowledgeAlert(errorId: string): void {
    const acknowledgedIds = this.getAcknowledgedIds();
    if (!acknowledgedIds.includes(errorId)) {
      acknowledgedIds.push(errorId);
      localStorage.setItem(this.localStorageKey, JSON.stringify(acknowledgedIds));

      const currentAlerts = this.alerts.getValue();
      const updatedAlerts = currentAlerts.map((alert) =>
        alert.errorId === errorId ? { ...alert, acknowledged: true } : alert,
      );
      this.alerts.next(updatedAlerts);
    }
  }

  private getAcknowledgedIds(): string[] {
    const storedIds = localStorage.getItem(this.localStorageKey);
    return storedIds ? JSON.parse(storedIds) : [];
  }
}
