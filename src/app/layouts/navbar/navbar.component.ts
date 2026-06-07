import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { CompareService } from '../../core/services/compare.service';
import { ThemeService } from '../../core/services/theme.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, SearchBarComponent],
  template: `
    <nav class="navbar navbar-expand-lg sticky-top bg-body border-bottom">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/" aria-label="ShopSphere home">
          <span class="brand-mark me-2">S</span>ShopSphere
        </a>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse gap-3" id="mainNav">
          <ul class="navbar-nav me-auto mb-3 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                Home
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/products" routerLinkActive="active">Products</a>
            </li>
          </ul>

          <div class="nav-search">
            <app-search-bar inputId="nav-search" placeholder="Search products" (searchChange)="search($event)" />
          </div>

          <div class="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            <button class="btn btn-outline-secondary icon-btn" type="button" (click)="theme.toggle()" aria-label="Toggle theme">
              <i class="bi" [class.bi-moon-stars]="theme.theme() === 'light'" [class.bi-sun]="theme.theme() === 'dark'"></i>
            </button>
            <a class="btn btn-outline-secondary icon-btn position-relative" routerLink="/wishlist" aria-label="Wishlist">
              <i class="bi bi-heart" aria-hidden="true"></i>
              <span class="badge text-bg-danger badge-count" *ngIf="wishlist.count()">{{ wishlist.count() }}</span>
            </a>
            <a class="btn btn-outline-secondary icon-btn position-relative" routerLink="/compare" aria-label="Compare products">
              <i class="bi bi-columns-gap" aria-hidden="true"></i>
              <span class="badge text-bg-info badge-count" *ngIf="compare.count()">{{ compare.count() }}</span>
            </a>
            <a class="btn btn-brand icon-btn position-relative" routerLink="/cart" aria-label="Cart">
              <i class="bi bi-bag" aria-hidden="true"></i>
              <span class="badge text-bg-warning badge-count" *ngIf="cart.totalItems()">{{ cart.totalItems() }}</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [
    `
      .brand-mark {
        display: inline-grid;
        width: 34px;
        height: 34px;
        place-items: center;
        border-radius: 8px;
        background: var(--app-primary);
        color: #fff;
      }

      .nav-search {
        width: min(360px, 100%);
      }

      .icon-btn {
        display: inline-grid;
        width: 42px;
        height: 42px;
        place-items: center;
      }

      .badge-count {
        position: absolute;
        top: -0.35rem;
        right: -0.35rem;
        min-width: 1.25rem;
      }
    `
  ]
})
export class NavbarComponent {
  constructor(
    readonly cart: CartService,
    readonly compare: CompareService,
    readonly theme: ThemeService,
    readonly wishlist: WishlistService,
    private readonly router: Router
  ) {}

  search(query: string): void {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length >= 2) {
      this.router.navigate(['/search'], { queryParams: { q: trimmedQuery } });
    }
  }
}
