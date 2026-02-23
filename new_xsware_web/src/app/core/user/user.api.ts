import { Injectable } from '@angular/core';
import { ApiClient } from '@app/core/http/api-client.service';
import { Observable } from 'rxjs';
import { UserInfo, UpdateUserInfoRequest } from './user.models';

@Injectable({ providedIn: 'root' })
export class UserApi {
  constructor(private api: ApiClient) {}

  getInfo(): Observable<UserInfo> {
    return this.api.get<UserInfo>('/api/users/info');
  }

  getAvatar(): Observable<Blob> {
    return this.api.getBlob('/api/users/info/avatar');
  }

  uploadAvatar(file: File): Observable<void> {

    const formData = new FormData();
    
    formData.append('file', file, file.name);

    return this.api.post<void>('/api/users/info/avatar', formData);
  }

  updateInfo(req: UpdateUserInfoRequest): Observable<void> {
    return this.api.put<void>('/api/users/info', req);
  }
}