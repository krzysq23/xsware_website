import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { SharedImports } from '@app/shared/imports';
import { ContactApi } from '@app/features/home/data-access/contact.api';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SharedImports
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactComponent {

  focus: any;
  contactForm: FormGroup;
  isSubmitted = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private contactApi: ContactApi,
    public toastr: ToastrService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)
      ]],
      phone: [''],
      company: [''],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit() {
    if (this.isLoading) return;

    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid) return;

    this.isLoading = true;

    this.contactApi.sendContactForm(this.contactForm.value)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.isSubmitted = true;
          this.contactForm.reset();

          this.toastr.success(
            'Dziękujemy! Wiadomość została wysłana.',
            'Sukces',
            {
              timeOut: 3000,
              positionClass: 'toast-bottom-right',
            }
          );
        },
        error: (err) => {
          console.error('Błąd wysyłki', err);
          this.toastr.error(
            'Wystąpił błąd podczas wysyłania wiadomości.',
            'Błąd',
            {
              timeOut: 3000,
              positionClass: 'toast-bottom-right',
            }
          );
        },
      });
  }
}