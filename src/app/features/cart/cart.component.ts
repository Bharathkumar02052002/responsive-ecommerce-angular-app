import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ImageFallbackDirective } from '../../shared/directives/image-fallback.directive';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, EmptyStateComponent, ImageFallbackDirective, RouterLink],
  template: `
    <section class="section-pad">
      <div class="container">
        <h1 class="display-6 fw-bold mb-4">Shopping cart</h1>
        <app-empty-state *ngIf="!cart.items().length" title="Your cart is empty" icon="bi-bag" />

        <div class="row g-4" *ngIf="cart.items().length">
          <div class="col-lg-8">
            <article class="surface rounded-3 p-3 mb-3" *ngFor="let item of cart.items()">
              <div class="row g-3 align-items-center">
                <div class="col-4 col-md-2">
                  <img class="cart-img product-image w-100" [src]="item.product.image" [alt]="item.product.title" appImageFallback />
                </div>
                <div class="col-8 col-md-5">
                  <h2 class="h6 mb-1">
                    <a class="text-decoration-none" [routerLink]="['/products', item.product.id]">{{ item.product.title }}</a>
                  </h2>
                  <p class="text-muted-app mb-0">{{ item.product.price | currency }}</p>
                </div>
                <div class="col-7 col-md-3">
                  <div class="btn-group" role="group" [attr.aria-label]="'Quantity for ' + item.product.title">
                    <button class="btn btn-outline-secondary" type="button" (click)="cart.decrement(item.product.id)">
                      <i class="bi bi-dash" aria-hidden="true"></i>
                    </button>
                    <span class="btn btn-outline-secondary disabled">{{ item.quantity }}</span>
                    <button class="btn btn-outline-secondary" type="button" (click)="cart.increment(item.product.id)">
                      <i class="bi bi-plus" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
                <div class="col-5 col-md-2 text-end">
                  <p class="fw-bold mb-2">{{ item.product.price * item.quantity | currency }}</p>
                  <button class="btn btn-sm btn-outline-danger" type="button" (click)="cart.remove(item.product.id)">
                    Remove
                  </button>
                </div>
              </div>
            </article>
          </div>

          <aside class="col-lg-4">
            <div class="surface rounded-3 p-4">
              <h2 class="h4">Order summary</h2>
              <div class="d-flex justify-content-between border-bottom py-3">
                <span>Items</span>
                <strong>{{ cart.totalItems() }}</strong>
              </div>
              <div class="d-flex justify-content-between border-bottom py-3">
                <span>Subtotal</span>
                <strong>{{ cart.subtotal() | currency }}</strong>
              </div>
              <div class="d-flex justify-content-between border-bottom py-3">
                <span>Shipping</span>
                <strong>{{ shipping() === 0 ? 'Free' : (shipping() | currency) }}</strong>
              </div>
              <div class="py-3">
                <div class="d-flex justify-content-between small mb-2">
                  <span>Free shipping</span>
                  <span>{{ freeShippingMessage() }}</span>
                </div>
                <div class="progress" aria-label="Free shipping progress">
                  <div class="progress-bar bg-success" [style.width.%]="freeShippingProgress()"></div>
                </div>
              </div>
              <div class="d-flex justify-content-between py-3 fs-5">
                <span>Total</span>
                <strong>{{ total() | currency }}</strong>
              </div>
              <button class="btn btn-brand w-100 mt-4" type="button">Proceed to checkout</button>
              <button class="btn btn-link text-danger w-100 mt-2" type="button" (click)="cart.clear()">Clear cart</button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .cart-img {
        height: 96px;
      }
    `
  ]
})
export class CartComponent {
  readonly freeShippingThreshold = 100;
  readonly shipping = computed(() => (this.cart.subtotal() >= this.freeShippingThreshold ? 0 : 9.99));
  readonly total = computed(() => this.cart.subtotal() + this.shipping());
  readonly freeShippingProgress = computed(() =>
    Math.min(100, Math.round((this.cart.subtotal() / this.freeShippingThreshold) * 100))
  );
  readonly freeShippingMessage = computed(() => {
    const remaining = this.freeShippingThreshold - this.cart.subtotal();
    return remaining <= 0 ? 'Unlocked' : `${remaining.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} away`;
  });

  constructor(readonly cart: CartService) {}
}
