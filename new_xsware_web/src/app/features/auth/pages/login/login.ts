import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SharedImports } from '@app/shared/imports';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@app/core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedImports
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  focus: any;
  focus1: any;
  submitted = false;
  loginForm: FormGroup;
  alert = {
    message: '',
    visible: false,
  };

  @ViewChild('emailTt') emailTt?: any;
  @ViewChild('pwdTt') pwdTt?: any;

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private route: ActivatedRoute,
    public toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [ 
        Validators.required, 
        Validators.email, 
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)] 
      ],
      password: ['', Validators.required],
      remember: ['']
    })
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  getEmailError(): string {
    if (!this.email?.touched) return '';
    if (this.email?.hasError('required')) return 'Email jest wymagany.';
    if (this.email?.hasError('email')) return 'Niepoprawny format email.';
    if (this.email?.hasError('pattern')) return 'Niepoprawny format email.';
    return '';
  }

  getPasswordError(): string {
    if (!this.password?.touched) return '';
    if (this.password?.hasError('required')) return 'Hasło jest wymagane.';
    if (this.password?.hasError('minlength'))
      return 'Hasło musi mieć co najmniej 6 znaków.';
    return '';
  }

  onSubmit() {
    this.submitted = true;
    this.loginForm.markAllAsTouched();
    this.emailTt?.close();
    this.pwdTt?.close();
    if (this.loginForm.invalid) {
      if (this.email?.invalid) this.emailTt?.open();
      if (this.password?.invalid) this.pwdTt?.open();
      return;
    }
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value)
    }
  }

  showAlert(message: string) {
    this.alert.message = message;
    this.alert.visible = true;
    setTimeout(() => {
      this.alert.visible = false;
    }, 10000);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const isLogout = params['registered'] === 'true';
      if (isLogout) {
        this.toastr.info('Użytkownik został zarejestrowany.\n Możesz się teraz zalogować!', 'Info', {
          timeOut: 3000,
          positionClass: 'toast-bottom-right',
        });
      }
    });
  }

}
