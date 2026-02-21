import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '@app/core/auth/api.service';
import { ToastrService } from 'ngx-toastr';
import { SharedImports } from '@app/shared/imports';

@Component({
  selector: 'app-contact',
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

  constructor(private fb: FormBuilder, private http: HttpClient, private dataService: ApiService, public toastr: ToastrService ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
      phone: [''],
      company: [''],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit() {
    
    if (this.contactForm.invalid) return;

    this.isLoading = true;
    const formData = this.contactForm.value;

    this.dataService.sendContactForm(formData).subscribe({
      next: () => {
        this.isSubmitted = true;
        this.isLoading = false;
        this.contactForm.reset();
        this.toastr.success('Dziękujemy! Wiadomość została wysłana.', 'Sukces', {
          timeOut: 3000,
          positionClass: 'toast-bottom-right',
        });
      },
      error: (err) => {
        console.error('Błąd wysyłki', err);
        this.isLoading = false;
      },
    });
  }
  
}