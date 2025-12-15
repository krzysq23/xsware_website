import { Component } from '@angular/core';
import { SharedImports } from '@app/shared/imports';

@Component({
  selector: 'projects-tabs-section',
  imports: [
    SharedImports
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {

  carousel1 = [
    {
      src: 'assets/img/other/xsware_screen_1.png',
      title: 'xsware.pl',
      desc: 'Widok strony xsware.pl.'
    },
    {
      src: 'assets/img/other/xsware_screen_2.png',
      title: 'xsware.pl',
      desc: 'Widok strony xsware.pl.'
    }
  ];

  carousel2 = [
    {
      src: 'assets/img/other/saldoplaner_screen_1.png',
      title: 'Saldo Planer',
      desc: 'Strona Saldo Planer.'
    },
    {
      src: 'assets/img/other/saldoplaner_screen_2.png',
      title: 'Saldo Planer',
      desc: 'Strona Saldo Planer.'
    },
    {
      src: 'assets/img/other/saldoplaner_screen_3.png',
      title: 'Saldo Planer',
      desc: 'Strona Saldo Planer.'
    }
  ];

}
