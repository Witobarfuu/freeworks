import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import {
  AlertState
} from '../../core/services/alert-state';


@Component({
  selector: 'app-sidebar',

  imports: [
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {

  readonly alerts =
    inject(AlertState);


  ngOnInit(): void {

    this.alerts.refresh();

  }

}