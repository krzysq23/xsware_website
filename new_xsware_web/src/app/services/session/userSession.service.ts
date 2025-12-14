import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {

  constructor(
    private cookieService: CookieService
  ) {}

  setUser(user: { email: string; firstName: string; login: string }) {
    this.cookieService.set('userData', user.email + ";" + user.firstName + ";" + user.login, { secure: true, sameSite: 'Strict' });
  }

  email() {
    return this.cookieService.get('userData').split(';')[0];
  }

  firstName() {
    return this.cookieService.get('userData').split(';')[1];
  }

  login() {
    return this.cookieService.get('userData').split(';')[2];
  }

  userData () {
    return {
      firstName: this.firstName(),
      login: this.login(),
      email: this.email()
    }
  }

  clear() {
    this.cookieService.delete('userData');
  }

}