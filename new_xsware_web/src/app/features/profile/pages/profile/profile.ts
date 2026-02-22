import { Component } from '@angular/core';
import { SharedImports } from '@app/shared/imports';

@Component({
  selector: 'app-profile',
  imports: [
    SharedImports
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent {
  
  userData = {} as any;
  active = 1;

}
