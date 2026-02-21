import { Component } from '@angular/core';
import { SharedImports } from '@app/shared/imports';
import { UserSessionService } from '@app/core/auth/userSession.service';

@Component({
  selector: 'app-profile',
  imports: [
    SharedImports
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  userData = {} as any;
  active = 1;

  constructor(private userSession: UserSessionService) {
    this.userData = userSession.userData();
  }
}
