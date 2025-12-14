import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHandlerFn, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environments';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(
    public toastr: ToastrService,
  ) {}


  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  userLogin(credentials: any): Observable<any> {
    return this.http.post<{ token: string, name: string }>(
        this.apiUrl + environment.loginEndpoint, 
        credentials
    ).pipe(
      catchError((err: HttpErrorResponse) => this.handleError(err))
    );
  }

  registerUser(registerForm: any): Observable<any> {
    return this.http.post<{ message: string }>(
        this.apiUrl + environment.registerEndpoint, 
        registerForm
    ).pipe(
      catchError((err: HttpErrorResponse) => this.handleError(err))
    );
  }

  authStatus() : Observable<any> {
    return this.http.get(this.apiUrl + environment.authStatusEndpoint).pipe();
  }

  sendContactForm(contactForm: any): Observable<any> {
    return this.http.post(
        this.apiUrl + environment.contactFormEndpoint, 
        contactForm
    ).pipe(
      catchError((err: HttpErrorResponse) => this.handleError(err))
    );
  }

  private handleError(resp: HttpErrorResponse) {
    this.toastr.error(resp.error != null ? resp.error.message : resp.message, 'Błąd', {
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
    });
    if (resp.error.error instanceof ErrorEvent) {
      return throwError(() => new Error(`Błąd klienta: ${resp.error.error.message}`));
    } else {
      return throwError(() => new Error(`Błąd serwera: ${resp.error.status} ${resp.error.message}`));
    }
  }
  
}

export function authUnterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const token = localStorage.getItem('token');
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }
  return next(req);
}
