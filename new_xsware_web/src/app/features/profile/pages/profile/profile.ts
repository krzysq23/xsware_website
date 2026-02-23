import { Component, inject, computed } from '@angular/core';
import { SharedImports } from '@app/shared/imports';
import { UserStore } from '@app/core/user/user.store';

@Component({
  selector: 'app-profile',
  imports: [
    SharedImports
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent {
  
  active = 1;
    
  private user = inject(UserStore);
  email = computed(() => this.user.email());
  firstName = computed(() => this.user.firstName());
  lastName = computed(() => this.user.lastName());
  phone = computed(() => this.user.phone());
  avatarUrl = computed(() => this.user.avatarUrl());

}
