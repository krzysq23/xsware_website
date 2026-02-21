import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly _accessToken = signal<string | null>(null);

  accessToken = this._accessToken.asReadonly();

  setAccessToken(token: string | null) {
    this._accessToken.set(token);
  }

  clear() {
    this._accessToken.set(null);
  }

  isAuthenticated(): boolean {
    return !!this._accessToken();
  }
}