import { Injectable } from '@angular/core';
import { catchError, finalize, of, tap, map, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthApi } from '@app/features/auth/data-access/auth.api';
import { SessionStore } from './session.store';
import { UserApi } from '@app/core/user/user.api';
import { UserStore } from '@app/core/user/user.store';
import { LoginRequest, RegisterRequest } from '@app/features/auth/data-access/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthFacade {

  private bootstrapInFlight = false;

  constructor(
    private authApi: AuthApi, 
    private session: SessionStore,
    private userApi: UserApi,
    private userStore: UserStore
  ) {}

  bootstrap() {
    if (this.bootstrapInFlight) {
      return of(null).pipe(
        tap(() => this.session.setInitialized(true)),
      );
    }
    this.bootstrapInFlight = true;

    return this.authApi.refresh().pipe(
      tap(res => this.session.setAccessToken(res.accessToken)),
      switchMap(() => this.userStore.loadUser()),
      catchError((err: unknown) => {
        this.session.clear();
        this.userStore.clear();
        if (err instanceof HttpErrorResponse && (err.status === 400 || err.status === 401)) {
          this.authApi.logout().subscribe({ error: () => {} });
        }
        return of(null);
      }),
      finalize(() => this.session.setInitialized(true)),
    );
  }

  login(req: LoginRequest) {
    return this.authApi.login(req).pipe(
      tap(res => this.session.setAccessToken(res.accessToken)),
      switchMap(() => this.userStore.loadUser())
    );
  }

  register(req: RegisterRequest) {
    return this.authApi.register(req).pipe(
      tap(res => this.session.setAccessToken(res.accessToken)),
      switchMap(() => this.userStore.loadUser())
    );
  }

  refresh() {
    return this.authApi.refresh().pipe(
      tap(res => this.session.setAccessToken(res.accessToken))
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