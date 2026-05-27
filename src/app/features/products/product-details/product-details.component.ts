import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { CartService } from '../../../core/services/cart.service';
import { ProductApiService } from '../../../core/services/product-api.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { Product } from '../../../models/product.model';
import { ImageFallbackDirective } from '../../../shared/directives/image-fallback.directive';
import { ProductCategoryPipe } from '../../../shared/pipes/product-category.pipe';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ImageFallbackDirective, LoaderComponent, ProductCategoryPipe, RouterLink],
  template: `
    <section class="section-pad">
      <div class="container">
        <app-loader *ngIf="loading()" />
        <div *ngIf="error()" class="alert alert-danger" role="alert">{{ error() }}</div>

        <article *ngIf="product() as item" class="row g-4 align-items-center">
          <div class="col-lg-6">
            <div class="surface rounded-3 p-4">
              <img class="detail-image product-image w-100" [src]="item.image" [alt]="item.title" appImageFallback />
            </div>
          </div>
          <div class="col-lg-6">
            <span class="badge rounded-pill text-bg-light mb-3">{{ item.category | productCategory }}</span>
            <h1 class="display-6 fw-bold">{{ item.title }}</h1>
            <div class="d-flex align-items-center gap-3 my-3">
              <span class="fs-3 fw-bold">{{ item.price | currency }}</span>
              <span class="text-muted-app">
                <i class="bi bi-star-fill text-warning" aria-hidden="true"></i>
                {{ item.rating.rate }} ({{ item.rating.count }} reviews)
              </span>
            </div>
            <p class="lead text-muted-app">{{ item.description }}</p>
            <div class="d-flex flex-column flex-sm-row gap-2 mt-4">
              <button class="btn btn-brand btn-lg" type="button" (click)="cart.add(item)">
                <i class="bi bi-bag-plus me-1" aria-hidden="true"></i>
                Add to cart
              </button>
              <button
                class="btn btn-outline-secondary btn-lg"
                type="button"
                (click)="wishlist.toggle(item)"
                [attr.aria-pressed]="wishlist.isWishlisted(item.id)"
              >
                <i
                  class="bi"
                  [class.bi-heart-fill]="wishlist.isWishlisted(item.id)"
                  [class.bi-heart]="!wishlist.isWishlisted(item.id)"
                  aria-hidden="true"
                ></i>
                Wishlist
              </button>
            </div>
            <a class="btn btn-link px-0 mt-3" routerLink="/products">Back to products</a>
          </div>
        </article>
      </div>
    </section>
  `,
  styles: [
    `
      .detail-image {
        height: min(520px, 70vh);
      }
    `
  ]
})
export class ProductDetailsComponent implements OnInit {
  readonly product = signal<Product | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  constructor(
    readonly cart: CartService,
    readonly wishlist: WishlistService,
    private readonly destroyRef: DestroyRef,
    private readonly productApi: ProductApiService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => this.productApi.getProduct(Number(params.get('id')))),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (product) => {
          this.product.set(product);
          this.loading.set(false);
        },
        error: (error: Error) => {
          this.error.set(error.message);
          this.loading.set(false);
        }
      });
  }
}
