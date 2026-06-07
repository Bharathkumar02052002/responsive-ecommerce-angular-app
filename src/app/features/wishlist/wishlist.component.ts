import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { CartService } from '../../core/services/cart.service';
import { CompareService } from '../../core/services/compare.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent, ProductCardComponent],
  template: `
    <section class="section-pad">
      <div class="container">
        <h1 class="display-6 fw-bold mb-4">Wishlist</h1>
        <app-empty-state *ngIf="!wishlist.items().length" title="No saved products" icon="bi-heart" />
        <div class="row g-3" *ngIf="wishlist.items().length">
          <div class="col-12 col-sm-6 col-lg-3" *ngFor="let product of wishlist.items()">
            <app-product-card
              [product]="product"
              [compared]="compare.has(product.id)"
              [wishlisted]="true"
              (addToCart)="cart.add($event)"
              (toggleCompare)="compare.toggle($event)"
              (toggleWishlist)="wishlist.toggle($event)"
            />
          </div>
        </div>
      </div>
    </section>
  `
})
export class WishlistComponent {
  constructor(
    readonly cart: CartService,
    readonly compare: CompareService,
    readonly wishlist: WishlistService
  ) {}
}
