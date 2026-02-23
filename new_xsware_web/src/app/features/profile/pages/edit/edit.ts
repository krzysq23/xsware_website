import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SharedImports } from '@app/shared/imports';
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
  private toastr = inject(ToastrService);

  email = computed(() => this.user.email());
  firstName = computed(() => this.user.firstName());
  lastName = computed(() => this.user.lastName());
  phone = computed(() => this.user.phone());
  avatarUrl = computed(() => this.user.avatarUrl());

  selectedAvatarFile: File | null = null;
  isAvatarUploading = false;

  avatarForm: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) {
    this.avatarForm = this.fb.group({
      file: ['']
    });
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
        const msg = (err instanceof HttpErrorResponse && err.error?.message != null) ? err.error.message : 'Nie udało się zapisać avatara.';
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

}
