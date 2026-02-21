import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SharedImports } from '@app/shared/imports';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@app/core/auth/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedImports
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {

  focus: any;
  focus1: any;
  submitted = false;
  registerForm: FormGroup;
  alert = {
    message: '',
    visible: false,
  };

  @ViewChild('emailTt') emailTt?: any;
  @ViewChild('pwdTt') pwdTt?: any;
  @ViewChild('chkTt') chkTt?: any;

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private route: ActivatedRoute,
    public toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [ 
        Validators.required, 
        Validators.email, 
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/) 
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(4)
      ]],
      checkRegister: [false]
    })
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
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
      return 'Hasło musi mieć co najmniej 4 znaki.';
    return '';
  }

  getPolicyError(): string {
    if (!this.registerForm.value.checkRegister) 
      return 'Musisz zaakceptować regulamin.';
    return '';
  }

  onSubmit() {
    this.submitted = true;
    this.registerForm.markAllAsTouched();
    this.emailTt?.close();
    this.pwdTt?.close();
    if (this.registerForm.invalid) {
      if (this.email?.invalid) this.emailTt?.open();
      if (this.password?.invalid) this.pwdTt?.open();
      return;
    }
    if(!this.registerForm.value.checkRegister) {
      this.chkTt?.open();
      return;
    }
    if (this.registerForm.valid) {
      this.auth.register(this.registerForm.value)
    }
  }
  
}
