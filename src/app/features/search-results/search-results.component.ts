import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { ProductApiService } from '../../core/services/product-api.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { filterProducts } from '../../core/utils/product-utils';
import { Product } from '../../models/product.model';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent, LoaderComponent, ProductCardComponent, SearchBarComponent],
  template: `
    <section class="section-pad">
      <div class="container">
        <div class="mb-4">
          <p class="text-uppercase fw-semibold text-muted-app small mb-2">Search</p>
          <h1 class="display-6 fw-bold">Search results</h1>
          <app-search-bar [value]="query()" (searchChange)="query.set($event)" />
        </div>

        <app-loader *ngIf="loading()" variant="skeleton" />
        <app-empty-state
          *ngIf="!loading() && !results().length"
          title="No products found"
          message="Try another product name."
          icon="bi-search"
        />

        <div class="row g-3" *ngIf="!loading() && results().length">
          <div class="col-12 col-sm-6 col-lg-3" *ngFor="let product of results()">
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
  `
})
export class SearchResultsComponent implements OnInit {
  readonly products = signal<Product[]>([]);
  readonly query = signal('');
  readonly loading = signal(true);
  readonly results = computed(() => filterProducts(this.products(), this.query(), ''));

  constructor(
    readonly cart: CartService,
    readonly wishlist: WishlistService,
    private readonly destroyRef: DestroyRef,
    private readonly productApi: ProductApiService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.query.set(params.get('q') ?? '');
    });

    this.productApi
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => {
          this.products.set(products);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }
}
