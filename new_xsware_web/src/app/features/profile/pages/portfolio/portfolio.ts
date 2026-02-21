import { Component } from '@angular/core';
import { SharedImports } from '@app/shared/imports';
import { Cv } from '@features/profile/components/tabs/cv/cv';
import { Projects } from '@features/profile/components/tabs/projects/projects';

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
export class PortfolioComponent {
  active = 2;
}
