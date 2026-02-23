import { Injectable, signal, computed } from '@angular/core';
import { catchError, finalize, of, tap, switchMap } from 'rxjs';
import { UserApi } from './user.api';
import { UserInfo } from './user.models';

@Injectable({ providedIn: 'root' })
export class UserStore {
  
  private readonly _user = signal<UserInfo | null>(null);
  private readonly _avatarUrl = signal<string | null>(null);
  private readonly _uploadingAvatar = signal(false);
  
  user = this._user.asReadonly();
  avatarUrl = this._avatarUrl.asReadonly();
  uploadingAvatar = this._uploadingAvatar.asReadonly();

  email = computed(() => this._user()?.email ?? null);
  role = computed(() => this._user()?.role ?? null);
  firstName = computed(() => this._user()?.firstName ?? null);
  lastName = computed(() => this._user()?.lastName ?? null);
  phone = computed(() => this._user()?.phone ?? null);

  constructor(private userApi: UserApi) {}

  loadUser() {
    return this.userApi.getInfo().pipe(
      switchMap((user) => {
        this._user.set(user);

        if (!user.isAvatar) {
          this.clearAvatar();
          return of(null);
        }
        return this.userApi.getAvatar().pipe(
          tap(blob => {
            this.setAvatarFromBlob(blob);
          }),
          catchError(() => {
            this.clearAvatar();
            return of(null);
          })
        );
      }),
      catchError(() => {
        this.clear();
        return of(null);
      })
    );
  }

  private setAvatarFromBlob(blob: Blob) {
    if (this._avatarUrl()) {
      URL.revokeObjectURL(this._avatarUrl()!);
    }

    const url = URL.createObjectURL(blob);
    this._avatarUrl.set(url);
  }

  uploadAvatar(file: File) {

    this._uploadingAvatar.set(true);

    return this.userApi.uploadAvatar(file).pipe(
      switchMap(() => this.loadUser()),
      finalize(() => this._uploadingAvatar.set(false)),
    );
  }

  private clearAvatar() {
    if (this._avatarUrl()) {
      URL.revokeObjectURL(this._avatarUrl()!);
    }
    this._avatarUrl.set(null);
  }

  setUser(user: UserInfo | null) {
    this._user.set(user);
  }

  clear() {
    this._user.set(null);
  }

}