import { Injectable } from '@angular/core';
import { ApiClient } from '@app/core/http/api-client.service';
import { Observable } from 'rxjs';
import { UserInfo } from './user.models';

@Injectable({ providedIn: 'root' })
export class UserApi {
  constructor(private api: ApiClient) {}

  getInfo(): Observable<UserInfo> {
    return this.api.get<UserInfo>('/api/users/info');
  }
}