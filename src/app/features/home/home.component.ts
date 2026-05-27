import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { ProductApiService } from '../../core/services/product-api.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product } from '../../models/product.model';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LoaderComponent, ProductCardComponent, RouterLink],
  template: `
    <section class="home-hero">
      <div class="container">
        <div class="row align-items-center g-4">
          <div class="col-lg-7">
            <p class="text-uppercase fw-semibold small mb-2">Angular 16 storefront</p>
            <h1 class="display-4 fw-bold">ShopSphere</h1>
            <p class="lead mb-4">
              A responsive ecommerce product listing experience with signals, lazy routes, FakeStore API, and persistent
              cart and wishlist state.
            </p>
            <div class="d-flex flex-column flex-sm-row gap-2">
              <a class="btn btn-brand btn-lg" routerLink="/products">Browse products</a>
              <a class="btn btn-outline-light btn-lg" routerLink="/wishlist">View wishlist</a>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="hero-panel rounded-3 p-4">
              <p class="small text-uppercase fw-semibold mb-2">Portfolio highlights</p>
              <div class="row g-3">
                <div class="col-6" *ngFor="let stat of stats">
                  <div class="stat-tile rounded-3 p-3">
                    <p class="h3 fw-bold mb-1">{{ stat.value }}</p>
                    <p class="small mb-0">{{ stat.label }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-pad">
      <div class="container">
        <div class="d-flex justify-content-between align-items-end gap-3 mb-4">
          <div>
            <p class="text-uppercase fw-semibold text-muted-app small mb-2">Featured</p>
            <h2 class="h1 fw-bold mb-0">Popular picks</h2>
          </div>
          <a class="btn btn-outline-secondary" routerLink="/products">View all</a>
        </div>

        <app-loader *ngIf="loading()" variant="skeleton" />
        <div class="row g-3" *ngIf="!loading()">
          <div class="col-12 col-sm-6 col-lg-3" *ngFor="let product of featuredProducts()">
            <app-product-card
              [product]="product"
              [wishlisted]="wishlist.isWishlisted(product.id)"
              (addToCart)="cart.add($event)"
              (toggleWishlist)="wishlist.toggle($event)"
            />
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .home-hero {
        padding: 4rem 0 3rem;
        color: #fff;
        background:
          linear-gradient(115deg, rgba(10, 82, 77, 0.94), rgba(17, 24, 39, 0.82)),
          url('https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1600&q=80')
            center/cover;
      }

      .hero-panel {
        background: rgba(255, 255, 255, 0.14);
        border: 1px solid rgba(255, 255, 255, 0.24);
        backdrop-filter: blur(12px);
      }

      .stat-tile {
        min-height: 112px;
        background: rgba(255, 255, 255, 0.14);
      }
    `
  ]
})
export class HomeComponent implements OnInit {
  readonly featuredProducts = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly stats = [
    { value: '20+', label: 'API products' },
    { value: '7', label: 'Lazy pages' },
    { value: '2', label: 'Persistent stores' },
    { value: '100%', label: 'Responsive UI' }
  ];

  constructor(
    readonly cart: CartService,
    readonly wishlist: WishlistService,
    private readonly destroyRef: DestroyRef,
    private readonly productApi: ProductApiService
  ) {}

  ngOnInit(): void {
    this.productApi
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => {
          this.featuredProducts.set(products.slice(0, 4));
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }
}
