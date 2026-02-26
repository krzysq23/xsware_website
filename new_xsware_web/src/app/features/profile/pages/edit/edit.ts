import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SharedImports } from '@app/shared/imports';
import { finalize } from 'rxjs/operators';
import { UserStore } from '@app/core/user/user.store';
import { AuthFacade } from '@app/core/auth/auth.facade';
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
  private authFacade = inject(AuthFacade);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private modalService = inject(NgbModal);
  private passwordModalRef?: NgbModalRef;

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

  isSubmitting = false;
  loading = signal(false);
  closeResult: string = '';
  changePassError = signal<string | null>(null);

  changePasswordForm = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: [this.passwordMatchValidator] }
  );

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
      this.toastr.error('Dozwolone formaty: PNG, JPG, WEBP.', 'Błąd', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right',
      });
      input.value = '';
      this.selectedAvatarFile = null;
      return;
    }

    if (file.size > maxSizeMb * 1024 * 1024) {
      this.toastr.error(`Maksymalny rozmiar: ${maxSizeMb}MB.`, 'Błąd', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right',
      });
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
          timeOut: 3500,
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
      this.toastr.error('Nie można zapisać – brak danych użytkownika.', 'Błąd', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right',
      });
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
            timeOut: 3500,
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

  openPasswordModal(content: any) {

    this.passwordModalRef = this.modalService.open(content, { centered: true });

    this.passwordModalRef.result.then(
      (result) => this.closeResult = `Closed with: ${result}`,
      (reason) => this.closeResult = `Dismissed ${reason}`
    );
  }

  onChangePasswordSubmit() {

    this.changePassError.set(null);

    if (!this.validateChangePasswordForm()) return;

    const { currentPassword, newPassword } = this.changePasswordForm.value;

    this.loading.set(true);
    this.changePassError.set(null);

    this.authFacade.changePasswordAndLogout(currentPassword!, newPassword!)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.passwordModalRef?.close('password_changed');
          this.passwordModalRef = undefined;
          this.toastr.success('Hasło zmienione. Zaloguj się ponownie.', 'Sukces', {
            timeOut: 3500,
            positionClass: 'toast-bottom-right',
          });
        },
        error: (err) => {
          const msg = this.mapError(err, 'Nie udało się zmienić hasła.');
          this.toastr.error(msg, 'Błąd', {
            timeOut: 3500,
            positionClass: 'toast-bottom-right',
          });
        }
      });
  }

  private validateChangePasswordForm(): boolean {

    if (this.changePasswordForm.valid) return true;

    this.changePasswordForm.markAllAsTouched();

    const errorMessage = this.getFormValidationError();

    this.changePassError.set(errorMessage);

    return false;
  }

  private getFormValidationError(): string {

    const controls = this.changePasswordForm.controls;

    if (controls.currentPassword.errors?.['required']) {
      return 'Podaj obecne hasło';
    }
    if (controls.newPassword.errors?.['required']) {
      return 'Podaj nowe hasło';
    }
    if (controls.newPassword.errors?.['minlength']) {
      return 'Nowe hasło musi mieć minimum 4 znaki';
    }
    if (controls.confirmPassword.errors?.['required']) {
      return 'Potwierdź nowe hasło';
    }
    if (this.changePasswordForm.errors?.['passwordMismatch']) {
      return 'Hasła nie są takie same';
    }
    return 'Formularz zawiera błędy';
  }

  private passwordMatchValidator(group: any) {
    const newPass = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return newPass === confirm ? null : { passwordMismatch: true };
  }

  private mapError(err: unknown, fallback: string): string {
    if (err instanceof HttpErrorResponse && err.error?.message != null) {
      return err.error.message;
    } else {
      return fallback;
    }
  }

}
