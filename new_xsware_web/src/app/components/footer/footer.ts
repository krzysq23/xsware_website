import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedImports } from '@app/shared/imports';

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

    constructor(private router: Router ) {}

    ngOnInit() {

    }
    getPath(){
      return this.router.url;
    }
}
