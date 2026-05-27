import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BreadcrumbComponent } from './layouts/breadcrumb/breadcrumb.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BreadcrumbComponent, FooterComponent, NavbarComponent, RouterOutlet, ToastContainerComponent],
  template: `
    <app-navbar />
    <main class="app-main">
      <app-breadcrumb />
      <router-outlet />
    </main>
    <app-footer />
    <app-toast-container />
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}
