import { Component } from '@angular/core';
import { SharedImports } from '@app/shared/imports';
import { Cv } from '@pages/portfolio/tabs/cv/cv';
import { Projects } from '@pages/portfolio/tabs/projects/projects';

@Component({
  selector: 'app-portfolio',
  imports: [
    SharedImports,
    Cv,
    Projects
  ],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
})
export class Portfolio {
  active = 1;
}
