import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '@app/core/http/api-client.service';
import { AuthTokenResponse, LoginRequest, RegisterRequest } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  constructor(private api: ApiClient) {}

  register(req: RegisterRequest): Observable<AuthTokenResponse> {
    return this.api.post<AuthTokenResponse>('/api/auth/register', req);
  }

  login(req: LoginRequest): Observable<AuthTokenResponse> {
    return this.api.post<AuthTokenResponse>('/api/auth/login', req);
  }

  refresh(): Observable<AuthTokenResponse> {
    return this.api.post<AuthTokenResponse>('/api/auth/refresh', {});
  }

  logout(): Observable<void> {
    return this.api.post<void>('/api/auth/logout', {});
  }
}