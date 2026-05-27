import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="section-pad">
      <div class="container">
        <div class="surface rounded-3 text-center p-5">
          <p class="display-1 fw-bold text-muted-app">404</p>
          <h1 class="display-6 fw-bold">Page not found</h1>
          <p class="text-muted-app">The page you are looking for does not exist or may have moved.</p>
          <a class="btn btn-brand" routerLink="/products">Browse products</a>
        </div>
      </div>
    </section>
  `
})
export class NotFoundComponent {}
