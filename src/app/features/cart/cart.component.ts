import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { getDeliveryWindow } from '../../core/utils/delivery-utils';
import { Product } from '../../models/product.model';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ImageFallbackDirective } from '../../shared/directives/image-fallback.directive';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, EmptyStateComponent, FormsModule, ImageFallbackDirective, RouterLink],
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
                  <label class="form-label small fw-semibold mt-3" [for]="'cart-note-' + item.product.id">
                    Order note
                  </label>
                  <textarea
                    class="form-control form-control-sm"
                    rows="2"
                    maxlength="120"
                    [id]="'cart-note-' + item.product.id"
                    [name]="'cart-note-' + item.product.id"
                    [ngModel]="item.note || ''"
                    (ngModelChange)="cart.updateNote(item.product.id, $event)"
                    placeholder="Color preference, gift note, delivery instruction"
                  ></textarea>
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
                  <button class="btn btn-sm btn-outline-secondary mb-2" type="button" (click)="saveForLater(item.product)">
                    Save for later
                  </button>
                  <button class="btn btn-sm btn-outline-danger d-block ms-auto" type="button" (click)="cart.remove(item.product.id)">
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
                <span>Item notes</span>
                <strong>{{ noteCount() }}</strong>
              </div>
              <div class="d-flex justify-content-between border-bottom py-3">
                <span>Subtotal</span>
                <strong>{{ cart.subtotal() | currency }}</strong>
              </div>
              <div class="d-flex justify-content-between border-bottom py-3">
                <span>Shipping</span>
                <strong>{{ shipping() === 0 ? 'Free' : (shipping() | currency) }}</strong>
              </div>
              <form class="border-bottom py-3" (ngSubmit)="applyPromoCode()">
                <label class="form-label small fw-semibold" for="promoCode">Promo code</label>
                <div class="input-group">
                  <input
                    id="promoCode"
                    class="form-control"
                    name="promoCode"
                    type="text"
                    autocomplete="off"
                    placeholder="Try SAVE10"
                    [ngModel]="promoCode()"
                    (ngModelChange)="promoCode.set($event)"
                  />
                  <button class="btn btn-outline-secondary" type="submit">Apply</button>
                </div>
                <p class="small mb-0 mt-2" [class.text-success]="appliedPromoCode()" [class.text-danger]="promoError()">
                  {{ promoMessage() }}
                </p>
              </form>
              <div class="d-flex justify-content-between border-bottom py-3" *ngIf="discount() > 0">
                <span>Discount</span>
                <strong class="text-success">-{{ discount() | currency }}</strong>
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
              <div class="d-flex justify-content-between border-top border-bottom py-3">
                <span>Estimated delivery</span>
                <strong>{{ deliveryWindow }}</strong>
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
  readonly deliveryWindow = getDeliveryWindow();
  readonly freeShippingThreshold = 100;
  readonly promoCode = signal('');
  readonly appliedPromoCode = signal('');
  readonly promoError = signal('');
  readonly shipping = computed(() => (this.cart.subtotal() >= this.freeShippingThreshold ? 0 : 9.99));
  readonly discount = computed(() => (this.appliedPromoCode() ? this.cart.subtotal() * 0.1 : 0));
  readonly noteCount = computed(() => this.cart.items().filter((item) => item.note?.trim()).length);
  readonly total = computed(() => Math.max(0, this.cart.subtotal() - this.discount()) + this.shipping());
  readonly freeShippingProgress = computed(() =>
    Math.min(100, Math.round((this.cart.subtotal() / this.freeShippingThreshold) * 100))
  );
  readonly promoMessage = computed(() => {
    if (this.appliedPromoCode()) {
      return `${this.appliedPromoCode()} applied for 10% off`;
    }

    return this.promoError() || 'Use SAVE10 for a sample discount';
  });
  readonly freeShippingMessage = computed(() => {
    const remaining = this.freeShippingThreshold - this.cart.subtotal();
    return remaining <= 0 ? 'Unlocked' : `${remaining.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} away`;
  });

  constructor(
    readonly cart: CartService,
    private readonly wishlist: WishlistService
  ) {}

  applyPromoCode(): void {
    const normalizedCode = this.promoCode().trim().toUpperCase();

    if (normalizedCode === 'SAVE10') {
      this.appliedPromoCode.set(normalizedCode);
      this.promoError.set('');
      return;
    }

    this.appliedPromoCode.set('');
    this.promoError.set('Promo code is not valid');
  }

  saveForLater(product: Product): void {
    this.wishlist.add(product);
    this.cart.remove(product.id);
  }
}
