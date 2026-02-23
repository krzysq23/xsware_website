import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SharedImports } from '@app/shared/imports';
import { finalize } from 'rxjs/operators';
import { UserStore } from '@app/core/user/user.store';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedImports
  ],
  templateUrl: './edit.html',
  styleUrl: './edit.scss',
})
export class EditComponent {

  private user = inject(UserStore);
  private userStore = inject(UserStore);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  email = computed(() => this.user.email());
  firstName = computed(() => this.user.firstName());
  lastName = computed(() => this.user.lastName());
  phone = computed(() => this.user.phone());
  avatarUrl = computed(() => this.user.avatarUrl());

  selectedAvatarFile: File | null = null;
  isAvatarUploading = false;
  isSavingUserData = false;

  avatarForm = this.fb.group({
    file: ['']
  });

  userDataForm = this.fb.group({
    firstName: ['', [Validators.maxLength(100)]],
    lastName: ['', [Validators.maxLength(100)]],
    phone: ['', [Validators.maxLength(20)]],
  });

  constructor() {
    const user = this.userStore.user?.();
    if (user) {
      this.userDataForm.patchValue({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        phone: user.phone ?? '',
      });
    }
  }

  onAvatarSelected(event: Event) {
    
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      this.selectedAvatarFile = null;
      return;
    }

    const maxSizeMb = 2;
    const allowed = ['image/png', 'image/jpeg', 'image/webp'];

    if (!allowed.includes(file.type)) {
      this.toastr.error('Dozwolone formaty: PNG, JPG, WEBP.', 'Błąd');
      input.value = '';
      this.selectedAvatarFile = null;
      return;
    }

    if (file.size > maxSizeMb * 1024 * 1024) {
      this.toastr.error(`Maksymalny rozmiar: ${maxSizeMb}MB.`, 'Błąd');
      input.value = '';
      this.selectedAvatarFile = null;
      return;
    }

    this.selectedAvatarFile = file;
  }

  onAvatarSubmit() {
    
    if (!this.selectedAvatarFile || this.isAvatarUploading) return;

    this.isAvatarUploading = true;

    this.userStore.uploadAvatar(this.selectedAvatarFile).subscribe({
      next: () => {
        this.toastr.success('Avatar zapisany.', 'Sukces', {
          timeOut: 2500,
          positionClass: 'toast-bottom-right',
        });
        this.selectedAvatarFile = null;

        const input = document.getElementById('avatarImg') as HTMLInputElement | null;
        if (input) input.value = '';
      },
      error: (err: unknown) => {
        const msg = this.mapError(err, 'Nie udało się zapisać avatara.');
        this.isAvatarUploading = false;
        this.toastr.error(msg, 'Błąd', {
          timeOut: 3000,
          positionClass: 'toast-bottom-right',
        });
      },
      complete: () => {
        this.isAvatarUploading = false;
      },
    });
  }

  onUserDataFormSubmit() {

    if (this.isSavingUserData) return;

    this.userDataForm.markAllAsTouched();
    if (this.userDataForm.invalid) return;

    const currentUser = this.userStore.user();
    if (!currentUser) {
      this.toastr.error('Nie można zapisać – brak danych użytkownika.', 'Błąd');
      return;
    }

    const req = {
      firstName: this.userDataForm.value.firstName ?? '',
      lastName: this.userDataForm.value.lastName ?? '',
      phone: this.userDataForm.value.phone ?? '',
      version: currentUser.version
    };

    this.isSavingUserData = true;

    this.userStore.updateUserInfo(req)
      .pipe(finalize(() => (this.isSavingUserData = false)))
      .subscribe({
        next: () => {
          this.toastr.success('Dane zostały zapisane.', 'Sukces', {
            timeOut: 2500,
            positionClass: 'toast-bottom-right',
          });
        },
        error: (err: unknown) => {
          const msg = this.mapError(err, 'Nie udało się zapisać danych.');
          this.toastr.error(msg, 'Błąd', {
            timeOut: 3500,
            positionClass: 'toast-bottom-right',
          });
        },
      });
  }

  private mapError(err: unknown, fallback: string): string {
    if (err instanceof HttpErrorResponse && err.error?.message != null) {
      return err.error.message;
    } else {
      return fallback;
    }
  }

}
