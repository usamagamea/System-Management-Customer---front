import { Component } from '@angular/core';
import { Navbar } from './client/models/constant/navbar';
import { INavbar } from './client/models/interface/navbar';

@Component({
  selector: 'app-root',
  template: `
    <div class="card text-center">
      <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs">
          <li class="nav-item" *ngFor="let item of NavBar">
            <a
              class="nav-link "
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              aria-current="true"
              [routerLink]="item.link"
              >{{ item.name }}</a
            >
          </li>
        </ul>
      </div>
      <div class="card-body">
        <router-outlet />
      </div>
    </div>
  `,
})
export class AppComponent {
  NavBar: INavbar[] = Navbar;
}
