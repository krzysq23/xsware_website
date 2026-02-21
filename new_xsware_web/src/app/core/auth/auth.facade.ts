import { Injectable } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { AuthApi } from '@app/features/auth/data-access/auth.api';
import { SessionStore } from './session.store';
import { LoginRequest, RegisterRequest } from '@app/features/auth/data-access/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  constructor(private authApi: AuthApi, private session: SessionStore) {}

  bootstrap() {
    return this.authApi.refresh().pipe(
      tap(res => this.session.setAccessToken(res.accessToken)),
      catchError(() => of(null)),
    );
  }


  login(req: LoginRequest) {
    return this.authApi.login(req).pipe(
      tap(res => this.session.setAccessToken(res.accessToken)),
    );
  }

  register(req: RegisterRequest) {
    return this.authApi.register(req).pipe(
      tap(res => this.session.setAccessToken(res.accessToken)),
    );
  }

  refresh() {
    return this.authApi.refresh().pipe(
      tap(res => this.session.setAccessToken(res.accessToken)),
    );
  }

  logout() {
    return this.authApi.logout().pipe(
      tap(() => this.session.clear()),
      catchError(() => {
        this.session.clear();
        return of(void 0);
      }),
    );
  }

  isAuthenticated() {
    return this.session.isAuthenticated();
  }
}