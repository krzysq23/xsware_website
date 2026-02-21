import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedImports } from '@app/shared/imports';
import { AuthService } from '@app/core/auth/auth.service';

@Component({
    selector: 'app-footer',
    imports: [ 
      SharedImports
    ],
    templateUrl: './footer.html',
    styleUrls: ['./footer.scss']
})
export class Footer implements OnInit {
    test : Date = new Date();
    public isLoggedIn = false;

    constructor(private router: Router, private authService: AuthService) {
      this.authService.isLoggedIn$.subscribe(status => {
            this.isLoggedIn = status;
        });
    }

    ngOnInit() {

    }
    getPath(){
      return this.router.url;
    }
}
