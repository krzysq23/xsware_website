import { Component } from '@angular/core';
import { SharedImports } from '@app/shared/imports';
import { CvComponent } from '@features/profile/components/tabs/cv/cv';
import { ProjectsComponent } from '@features/profile/components/tabs/projects/projects';

@Component({
  selector: 'app-portfolio',
  imports: [
    SharedImports,
    CvComponent,
    ProjectsComponent
  ],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
})
export class PortfolioComponent {
  active = 2;
}
