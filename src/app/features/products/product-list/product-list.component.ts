import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, DestroyRef, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { CartService } from '../../../core/services/cart.service';
import { ProductApiService } from '../../../core/services/product-api.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { filterProducts, paginate, sortProducts } from '../../../core/utils/product-utils';
import { Product, ProductSort } from '../../../models/product.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { FilterSidebarComponent } from '../../../shared/components/filter-sidebar/filter-sidebar.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    EmptyStateComponent,
    FilterSidebarComponent,
    FormsModule,
    LoaderComponent,
    ModalComponent,
    ProductCardComponent,
    SearchBarComponent
  ],
  template: `
    <section class="section-pad">
      <div class="container">
        <div class="products-head d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3 mb-4">
          <div>
            <p class="text-uppercase fw-semibold text-muted-app small mb-2">Catalog</p>
            <h1 class="display-6 fw-bold mb-2">Find products that fit your day</h1>
            <p class="text-muted-app mb-0">Search the catalog, narrow it by category, and save what you like.</p>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-outline-secondary d-lg-none" type="button" (click)="mobileFiltersOpen.set(true)">
              <i class="bi bi-sliders" aria-hidden="true"></i>
              Filters
            </button>
            <label class="visually-hidden" for="sortProducts">Sort products</label>
            <select id="sortProducts" class="form-select" [ngModel]="sort()" (ngModelChange)="setSort($event)">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Rating</option>
              <option value="name-asc">Name A-Z</option>
            </select>
          </div>
        </div>

        <div class="mb-4">
          <app-search-bar [value]="query()" (searchChange)="setQuery($event)" />
        </div>

        <app-loader *ngIf="loading()" variant="skeleton" label="Loading products" />

        <div *ngIf="error()" class="alert alert-danger" role="alert">
          {{ error() }}
        </div>

        <div *ngIf="!loading() && !error()" class="row g-4">
          <div class="col-lg-3 d-none d-lg-block">
            <app-filter-sidebar
              [categories]="categories()"
              [selectedCategory]="selectedCategory()"
              (categoryChange)="setCategory($event)"
            />
          </div>

          <div class="col-lg-9">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <p class="mb-0 text-muted-app">{{ filteredProducts().length }} products found</p>
              <p class="mb-0 fw-semibold">{{ subtotalPreview() | currency }} visible value</p>
            </div>

            <app-empty-state
              *ngIf="!filteredProducts().length"
              title="No matching products"
              message="Try a different search term or category."
              icon="bi-search"
              actionLabel=""
            />

            <div class="row g-3" *ngIf="filteredProducts().length">
              <div class="col-12 col-sm-6 col-xl-4" *ngFor="let product of visibleProducts(); trackBy: trackByProductId">
                <app-product-card
                  [product]="product"
                  [wishlisted]="wishlist.isWishlisted(product.id)"
                  (addToCart)="cart.add($event)"
                  (toggleWishlist)="wishlist.toggle($event)"
                />
              </div>
            </div>

            <div class="text-center mt-4" *ngIf="visibleProducts().length < filteredProducts().length">
              <button class="btn btn-outline-secondary" type="button" (click)="loadMore()">
                Load more products
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <app-modal title="Filter products" [open]="mobileFiltersOpen()" (close)="mobileFiltersOpen.set(false)">
      <app-filter-sidebar
        [categories]="categories()"
        [selectedCategory]="selectedCategory()"
        (categoryChange)="setCategory($event); mobileFiltersOpen.set(false)"
      />
    </app-modal>
  `
})
export class ProductListComponent implements OnInit {
  readonly products = signal<Product[]>([]);
  readonly categories = signal<string[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly query = signal('');
  readonly selectedCategory = signal('');
  readonly page = signal(1);
  readonly mobileFiltersOpen = signal(false);
  readonly sort = signal<ProductSort>('featured');

  readonly filteredProducts = computed(() =>
    sortProducts(filterProducts(this.products(), this.query(), this.selectedCategory()), this.sort())
  );
  readonly visibleProducts = computed(() => paginate(this.filteredProducts(), this.page(), 9));
  readonly subtotalPreview = computed(() =>
    this.visibleProducts().reduce((total, product) => total + product.price, 0)
  );

  constructor(
    readonly cart: CartService,
    readonly wishlist: WishlistService,
    private readonly destroyRef: DestroyRef,
    private readonly productApi: ProductApiService
  ) {}

  ngOnInit(): void {
    forkJoin({
      products: this.productApi.getProducts(),
      categories: this.productApi.getCategories()
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ products, categories }) => {
          this.products.set(products);
          this.categories.set(categories);
          this.loading.set(false);
        },
        error: (error: Error) => {
          this.error.set(error.message);
          this.loading.set(false);
        }
      });
  }

  setQuery(query: string): void {
    this.query.set(query);
    this.page.set(1);
  }

  setCategory(category: string): void {
    this.selectedCategory.set(category);
    this.page.set(1);
  }

  setSort(sort: ProductSort): void {
    this.sort.set(sort);
    this.page.set(1);
  }

  loadMore(): void {
    this.page.update((page) => page + 1);
  }

  trackByProductId(_: number, product: Product): number {
    return product.id;
  }
}
