import { Component, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedImports } from '@app/shared/imports';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthFacade } from '@app/core/auth/auth.facade';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedImports
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent implements OnInit {
  focus: any;
  focus1: any;

  submitted = false;
  loading = false;

  loginForm: FormGroup;

  alert = {
    message: '',
    visible: false,
  };

  @ViewChild('emailTt') emailTt?: any;
  @ViewChild('pwdTt') pwdTt?: any;

  private destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private auth: AuthFacade,
    private route: ActivatedRoute,
    private router: Router,
    public toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(4)
      ]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

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

  onSubmit() {
    if (this.loading) return;

    this.submitted = true;
    this.alert.visible = false;

    this.loginForm.markAllAsTouched();
    this.emailTt?.close();
    this.pwdTt?.close();

    if (this.loginForm.invalid) {
      if (this.email?.invalid) this.emailTt?.open();
      if (this.password?.invalid) this.pwdTt?.open();
      return;
    }

    const payload = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.loading = true;

    this.auth.login(payload).pipe(
      finalize(() => (this.loading = false)),
    ).subscribe({
      next: () => {
        this.toastr.success('Zalogowano.', 'Sukces', {
          timeOut: 2500,
          positionClass: 'toast-bottom-right',
        });

        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/profile';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err: unknown) => {
        const msg = this.mapAuthError(err, 'Nie udało się zalogować.');
        this.showAlert(msg);
        this.toastr.error(msg, 'Błąd', {
          timeOut: 3500,
          positionClass: 'toast-bottom-right',
        });
      },
    });
  }

  showAlert(message: string) {
    this.alert.message = message;
    this.alert.visible = true;
    setTimeout(() => {
      this.alert.visible = false;
    }, 10000);
  }

  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const registered = params['registered'] === 'true';
        if (registered) {
          this.toastr.info(
            'Użytkownik został zarejestrowany. Możesz się teraz zalogować!',
            'Info',
            { timeOut: 3000, positionClass: 'toast-bottom-right' }
          );
        }
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