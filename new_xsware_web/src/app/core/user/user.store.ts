import { Injectable, signal, computed } from '@angular/core';
import { catchError, finalize, of, tap, switchMap, throwError } from 'rxjs';
import { UserApi } from './user.api';
import { UserInfo, UpdateUserInfoRequest, BackendRole } from './user.models';

@Injectable({ providedIn: 'root' })
export class UserStore {
  
  private readonly _user = signal<UserInfo | null>(null);
  private readonly _avatarUrl = signal<string | null>(null);
  private readonly _uploadingAvatar = signal(false);
  private readonly _savingUserData = signal(false);

  user = this._user.asReadonly();
  avatarUrl = this._avatarUrl.asReadonly();
  uploadingAvatar = this._uploadingAvatar.asReadonly();
  savingUserData = this._savingUserData.asReadonly();

  private readonly roleMap: Record<BackendRole, string> = {
    ROLE_CLIENT: 'Klient',
    ROLE_ADMIN: 'Admin',
  };

  email = computed(() => this._user()?.email ?? null);
  firstName = computed(() => this._user()?.firstName ?? "Użytkownik");
  lastName = computed(() => this._user()?.lastName ?? null);
  phone = computed(() => this._user()?.phone ?? null);
  role = computed(() => {
    const rawRole = this._user()?.role as BackendRole | undefined;
    return rawRole ? this.roleMap[rawRole] : 'Klient';
  });

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

  updateUserInfo(req: UpdateUserInfoRequest) {
    
    this._savingUserData.set(true);

    return this.userApi.updateInfo(req).pipe(
      switchMap(() => this.loadUser()),
      finalize(() => this._savingUserData.set(false)),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }


  clear() {
    this._user.set(null);
  }

}