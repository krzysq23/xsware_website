import { Injectable } from '@angular/core';
import { ApiClient } from '@app/core/http/api-client.service';
import { Observable } from 'rxjs';
import { ContactRequest } from './contact.models';

@Injectable({ providedIn: 'root' })
export class ContactApi {
  constructor(private api: ApiClient) {}

  sendContactForm(data: ContactRequest): Observable<void> {
    return this.api.post<void>('/api/contact', data);
  }
}