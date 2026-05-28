import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="border-top py-4 mt-5">
      <div class="container d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
        <div>
          <p class="fw-semibold mb-1">ShopSphere</p>
          <p class="small text-muted-app mb-0">Responsive storefront built with Angular and Bootstrap.</p>
        </div>
        <nav class="d-flex gap-3 small" aria-label="Footer navigation">
          <a routerLink="/products">Products</a>
          <a routerLink="/wishlist">Wishlist</a>
          <a routerLink="/cart">Cart</a>
        </nav>
      </div>
    </footer>
  `
})
export class FooterComponent {}
