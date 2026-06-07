import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { CompareService } from '../../core/services/compare.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ImageFallbackDirective } from '../../shared/directives/image-fallback.directive';
import { ProductCategoryPipe } from '../../shared/pipes/product-category.pipe';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, EmptyStateComponent, ImageFallbackDirective, ProductCategoryPipe, RouterLink],
  template: `
    <section class="section-pad">
      <div class="container">
        <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
          <div>
            <p class="text-uppercase fw-semibold text-muted-app small mb-2">Compare</p>
            <h1 class="display-6 fw-bold mb-2">Product comparison</h1>
            <p class="text-muted-app mb-0">Compare up to 3 products by price, category, rating, and review count.</p>
          </div>
          <div class="d-flex align-items-start gap-2">
            <a class="btn btn-outline-secondary" routerLink="/products">Add products</a>
            <button class="btn btn-outline-danger" type="button" *ngIf="compare.count()" (click)="compare.clear()">
              Clear
            </button>
          </div>
        </div>

        <app-empty-state
          *ngIf="!compare.count()"
          title="No products selected"
          message="Add products from the catalog to compare them side by side."
          icon="bi-columns-gap"
        />

        <div class="surface rounded-3 compare-wrap" *ngIf="compare.count()">
          <table class="table table-hover align-middle mb-0">
            <caption class="visually-hidden">
              Product comparison table
            </caption>
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col" *ngFor="let product of compare.items()">
                  <a class="text-decoration-none" [routerLink]="['/products', product.id]">{{ product.title }}</a>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Image</th>
                <td *ngFor="let product of compare.items()">
                  <img class="compare-image product-image" [src]="product.image" [alt]="product.title" appImageFallback />
                </td>
              </tr>
              <tr>
                <th scope="row">Price</th>
                <td *ngFor="let product of compare.items()" class="fw-semibold">{{ product.price | currency }}</td>
              </tr>
              <tr>
                <th scope="row">Category</th>
                <td *ngFor="let product of compare.items()">{{ product.category | productCategory }}</td>
              </tr>
              <tr>
                <th scope="row">Rating</th>
                <td *ngFor="let product of compare.items()">
                  <i class="bi bi-star-fill text-warning" aria-hidden="true"></i>
                  {{ product.rating.rate }}
                </td>
              </tr>
              <tr>
                <th scope="row">Reviews</th>
                <td *ngFor="let product of compare.items()">{{ product.rating.count }}</td>
              </tr>
              <tr>
                <th scope="row">Actions</th>
                <td *ngFor="let product of compare.items()">
                  <div class="d-flex flex-column gap-2">
                    <button class="btn btn-sm btn-brand" type="button" (click)="cart.add(product)">Add to cart</button>
                    <button class="btn btn-sm btn-outline-danger" type="button" (click)="compare.remove(product.id)">
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .compare-wrap {
        overflow-x: auto;
      }

      .compare-wrap table {
        min-width: 760px;
      }

      .compare-image {
        width: 120px;
        height: 120px;
      }
    `
  ]
})
export class CompareComponent {
  constructor(
    readonly cart: CartService,
    readonly compare: CompareService
  ) {}
}
