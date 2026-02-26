import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedImports } from '@app/shared/imports';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { AuthFacade } from '@app/core/auth/auth.facade';
import { error } from 'console';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedImports],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthFacade);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public toastr = inject(ToastrService);

  focus: any;
  focus1: any;

  submitted = false;
  loading = false;

  alert = {
    message: '',
    visible: false,
  };

  registerForm: FormGroup = this.fb.group({
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/),
    ]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    checkRegister: [false],
  });

  @ViewChild('emailTt') emailTt?: any;
  @ViewChild('pwdTt') pwdTt?: any;
  @ViewChild('chkTt') chkTt?: any;

  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }

  getEmailError(): string {
    if (!this.email?.touched) return '';
    if (this.email.hasError('required')) return 'Email jest wymagany.';
    if (this.email.hasError('email') || this.email.hasError('pattern')) return 'Niepoprawny format email.';
    return '';
  }

  getPasswordError(): string {
    if (!this.password?.touched) return '';
    if (this.password.hasError('required')) return 'Hasło jest wymagane.';
    if (this.password.hasError('minlength')) return 'Hasło musi mieć co najmniej 4 znaki.';
    return '';
  }

  getPolicyError(): string {
    if (!this.registerForm.value.checkRegister) return 'Musisz zaakceptować regulamin.';
    return '';
  }

  onSubmit() {
    if (this.loading) return;

    this.submitted = true;
    this.alert.visible = false;
    this.registerForm.markAllAsTouched();

    this.emailTt?.close();
    this.pwdTt?.close();
    this.chkTt?.close();

    if (this.registerForm.invalid) {
      if (this.email?.invalid) this.emailTt?.open();
      if (this.password?.invalid) this.pwdTt?.open();
      return;
    }

    if (!this.registerForm.value.checkRegister) {
      this.chkTt?.open();
      return;
    }

    const payload = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    };

    this.loading = true;

    this.auth.register(payload).pipe(
      finalize(() => (this.loading = false)),
    ).subscribe({
      next: () => {
        this.toastr.success('Konto utworzone. Jesteś zalogowany.', 'Sukces', {
          timeOut: 3500,
          positionClass: 'toast-bottom-right',
        });
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/profile';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err: unknown) => {
        const msg = this.mapAuthError(err, 'Nie udało się zarejestrować.');
        this.alert = { visible: true, message: msg };
        this.toastr.error(msg, 'Błąd', {
          timeOut: 3500,
          positionClass: 'toast-bottom-right',
        });
      },
    });
  }

  private mapAuthError(err: unknown, fallback: string): string {
    if (err instanceof HttpErrorResponse && err.error?.message != null) {
      return err.error.message;
    } else {
      return fallback;
    }
  }
}