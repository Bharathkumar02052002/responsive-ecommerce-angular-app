import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { getStockStatus, StockStatus } from '../../../core/utils/product-utils';
import { Product } from '../../../models/product.model';
import { ImageFallbackDirective } from '../../directives/image-fallback.directive';
import { ProductCategoryPipe } from '../../pipes/product-category.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ImageFallbackDirective, ProductCategoryPipe, RouterLink],
  template: `
    <article class="card product-card hover-lift h-100">
      <a
        class="image-link"
        [class.image-link-list]="layout === 'list'"
        [routerLink]="['/products', product.id]"
        [attr.aria-label]="'View ' + product.title"
      >
        <img
          class="card-img-top product-image"
          [src]="product.image"
          [alt]="product.title"
          loading="lazy"
          appImageFallback
        />
      </a>
      <div class="card-body d-flex flex-column" [class.card-body-list]="layout === 'list'">
        <div class="d-flex align-items-center justify-content-between gap-2 mb-2">
          <span class="badge rounded-pill text-bg-light">{{ product.category | productCategory }}</span>
          <span class="small text-muted-app">
            <i class="bi bi-star-fill text-warning" aria-hidden="true"></i>
            {{ product.rating.rate }}
          </span>
        </div>
        <span
          class="badge stock-badge align-self-start mb-2"
          [class.text-bg-success]="stockStatus() === 'in-stock'"
          [class.text-bg-warning]="stockStatus() === 'low-stock'"
        >
          {{ stockStatus() === 'low-stock' ? 'Low stock' : 'In stock' }}
        </span>
        <h3 class="h6 product-title">
          <a class="stretched-title text-decoration-none" [routerLink]="['/products', product.id]">
            {{ product.title }}
          </a>
        </h3>
        <p class="fw-bold mb-3 mt-auto">{{ product.price | currency }}</p>
        <div class="d-grid gap-2">
          <button class="btn btn-brand" type="button" (click)="addToCart.emit(product)">
            <i class="bi bi-bag-plus me-1" aria-hidden="true"></i>
            Add to cart
          </button>
          <button *ngIf="showQuickView" class="btn btn-outline-secondary" type="button" (click)="quickView.emit(product)">
            <i class="bi bi-eye me-1" aria-hidden="true"></i>
            Quick view
          </button>
          <button
            class="btn btn-outline-secondary"
            type="button"
            (click)="toggleWishlist.emit(product)"
            [attr.aria-pressed]="wishlisted"
          >
            <i class="bi" [class.bi-heart-fill]="wishlisted" [class.bi-heart]="!wishlisted" aria-hidden="true"></i>
            {{ wishlisted ? 'Saved' : 'Wishlist' }}
          </button>
          <button
            class="btn btn-outline-secondary"
            type="button"
            (click)="toggleCompare.emit(product)"
            [attr.aria-pressed]="compared"
          >
            <i class="bi bi-columns-gap" aria-hidden="true"></i>
            {{ compared ? 'Comparing' : 'Compare' }}
          </button>
        </div>
      </div>
    </article>
  `,
  styles: [
    `
      .product-card {
        background: var(--app-surface);
        border-color: var(--app-border);
        border-radius: 8px;
        overflow: hidden;
      }

      :host-context(.product-card-list) .product-card {
        display: grid;
        grid-template-columns: minmax(180px, 240px) 1fr;
      }

      .image-link {
        display: grid;
        height: 220px;
        place-items: center;
        padding: 1rem;
        background: #fff;
      }

      .image-link-list {
        height: 100%;
        min-height: 260px;
      }

      .product-image {
        width: 100%;
        height: 100%;
      }

      .product-title {
        min-height: 3rem;
        line-height: 1.45;
      }

      .card-body-list .product-title {
        min-height: auto;
      }

      .stock-badge {
        font-weight: 600;
      }

      .stretched-title:focus-visible {
        outline: 3px solid rgba(15, 118, 110, 0.35);
        outline-offset: 3px;
      }

      @media (max-width: 767.98px) {
        :host-context(.product-card-list) .product-card {
          display: block;
        }

        .image-link-list {
          height: 220px;
          min-height: auto;
        }
      }
    `
  ]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() compared = false;
  @Input() layout: 'grid' | 'list' = 'grid';
  @Input() showQuickView = false;
  @Input() wishlisted = false;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() quickView = new EventEmitter<Product>();
  @Output() toggleCompare = new EventEmitter<Product>();
  @Output() toggleWishlist = new EventEmitter<Product>();

  stockStatus(): StockStatus {
    return getStockStatus(this.product);
  }
}
