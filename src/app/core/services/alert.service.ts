import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AlertViewModel } from '../models/alert-view.model';
import { RawContact } from '../models/alert.model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private dataUrl = 'assets/data.json';

  constructor(private http: HttpClient) { }

  getAlerts(): Observable<AlertViewModel[]> {
    return this.http.get<RawContact[]>(this.dataUrl).pipe(
      map(contacts => {
        return contacts.flatMap(contact =>
          contact.alerts.map(alert => ({
            ...alert,
            contactName: contact.contactName,
            contactBeginTimestamp: contact.contactBeginTimestamp,
            contactEndTimestamp: contact.contactEndTimestamp,
            contactSatellite: contact.contactSatellite,
            contactDetail: contact.contactDetail,
            acknowledged: false,
          }))
        );
      })
    );
  }
}

