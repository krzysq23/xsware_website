import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api.service';
import { UserSessionService } from '../session/userSession.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);
  
  constructor(
    private dataService: ApiService, 
    public toastr: ToastrService,
    private userSession: UserSessionService
  ) {}

  isLoggedIn$ = this.loggedIn.asObservable();

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  login(credentials: any) {
    this.dataService.userLogin(credentials).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.accessToken);
        const user = {
          email: response.user.email,
          firstName: response.user.userName,
          login: response.user.login
        };
        this.userSession.setUser(user);
        this.loggedIn.next(true);
        window.location.assign('/profile');
      }
    });
  }

  register(registerForm: any) {
    this.dataService.registerUser(registerForm).subscribe({
      next: (response) => {
        window.location.assign('/login?registered=true');
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.assign('/home?logout=true');
  }

  checkAuth(): void {
    console.log("checkAuth");
    const token = localStorage.getItem('token');
    if(token) {
      this.loggedIn.next(true);
      this.dataService.authStatus().subscribe({
        next: (response) => {
          // SUCCESS: Token is valid
        },
        error: (err) => {
          this.loggedIn.next(false);
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          window.location.assign('/home?logout=true');
        }
      });
    }

  }

}