import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly _accessToken = signal<string | null>(null);
  private readonly _initialized = signal(false);

  accessToken = this._accessToken.asReadonly();
  initialized = this._initialized.asReadonly();

  setAccessToken(token: string | null) {
    this._accessToken.set(token);
  }

  setInitialized(value: boolean) {
    this._initialized.set(value);
  }

  clear() {
    this._accessToken.set(null);
  }

  isAuthenticated(): boolean {
    return !!this._accessToken();
  }
}