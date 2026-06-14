import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, DestroyRef, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { CartService } from '../../../core/services/cart.service';
import { CompareService } from '../../../core/services/compare.service';
import { ProductApiService } from '../../../core/services/product-api.service';
import { RecentlyViewedService } from '../../../core/services/recently-viewed.service';
import { ToastService } from '../../../core/services/toast.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { getDeliveryWindow } from '../../../core/utils/delivery-utils';
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
            <div class="surface rounded-3 p-3 mt-4">
              <div class="d-flex gap-3">
                <i class="bi bi-truck fs-4 text-success" aria-hidden="true"></i>
                <div>
                  <p class="fw-semibold mb-1">Estimated delivery</p>
                  <p class="text-muted-app mb-0">{{ deliveryWindow }}</p>
                </div>
              </div>
            </div>
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
              <button
                class="btn btn-outline-secondary btn-lg"
                type="button"
                (click)="compare.toggle(item)"
                [attr.aria-pressed]="compare.has(item.id)"
              >
                <i class="bi bi-columns-gap" aria-hidden="true"></i>
                {{ compare.has(item.id) ? 'Comparing' : 'Compare' }}
              </button>
              <button class="btn btn-outline-secondary btn-lg" type="button" (click)="shareProduct(item)">
                <i class="bi bi-share" aria-hidden="true"></i>
                Share
              </button>
            </div>
            <a class="btn btn-link px-0 mt-3" routerLink="/products">Back to products</a>
          </div>
        </article>

        <section class="mt-5" *ngIf="recentProducts().length">
          <div class="d-flex justify-content-between align-items-end gap-3 mb-3">
            <div>
              <p class="text-uppercase fw-semibold text-muted-app small mb-1">Recently viewed</p>
              <h2 class="h4 mb-0">Pick up where you left off</h2>
            </div>
            <a class="btn btn-sm btn-outline-secondary" routerLink="/products">View catalog</a>
          </div>
          <div class="row g-3">
            <div class="col-6 col-md-3" *ngFor="let viewedProduct of recentProducts()">
              <a class="recent-card surface rounded-3 p-3 text-decoration-none h-100" [routerLink]="['/products', viewedProduct.id]">
                <img
                  class="recent-image product-image w-100 mb-3"
                  [src]="viewedProduct.image"
                  [alt]="viewedProduct.title"
                  loading="lazy"
                  appImageFallback
                />
                <span class="small fw-semibold d-block">{{ viewedProduct.title }}</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </section>
  `,
  styles: [
    `
      .detail-image {
        height: min(520px, 70vh);
      }

      .recent-card {
        display: block;
      }

      .recent-image {
        height: 118px;
      }
    `
  ]
})
export class ProductDetailsComponent implements OnInit {
  readonly deliveryWindow = getDeliveryWindow();
  readonly product = signal<Product | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly recentProducts = computed(() =>
    this.recentlyViewed.products().filter((item) => item.id !== this.product()?.id)
  );

  constructor(
    readonly cart: CartService,
    readonly compare: CompareService,
    readonly wishlist: WishlistService,
    private readonly destroyRef: DestroyRef,
    private readonly productApi: ProductApiService,
    private readonly recentlyViewed: RecentlyViewedService,
    private readonly route: ActivatedRoute,
    private readonly toast: ToastService
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
          this.recentlyViewed.add(product);
          this.loading.set(false);
        },
        error: (error: Error) => {
          this.error.set(error.message);
          this.loading.set(false);
        }
      });
  }

  async shareProduct(product: Product): Promise<void> {
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: `Check out ${product.title}`,
          url: shareUrl
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      this.toast.show('Product link copied');
    } catch {
      this.toast.show('Unable to share product right now', 'warning');
    }
  }
}
