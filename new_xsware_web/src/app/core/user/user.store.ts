import { Injectable, signal, computed } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { UserApi } from './user.api';
import { UserInfo } from './user.models';

@Injectable({ providedIn: 'root' })
export class UserStore {
  
  private readonly _user = signal<UserInfo | null>(null);

  user = this._user.asReadonly();

  email = computed(() => this._user()?.email ?? null);
  role = computed(() => this._user()?.role ?? null);
  firstName = computed(() => this._user()?.firstName ?? null);
  lastName = computed(() => this._user()?.lastName ?? null);
  phone = computed(() => this._user()?.phone ?? null);

  constructor(private userApi: UserApi) {}

  loadUser() {
    return this.userApi.getInfo().pipe(
      tap((user) => this._user.set(user)),
      catchError((err) => {
        this._user.set(null);
        return of(null);
      })
    );
  }

  setUser(user: UserInfo | null) {
    this._user.set(user);
  }

  clear() {
    this._user.set(null);
  }

}