import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductCategoryPipe } from '../../pipes/product-category.pipe';

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule, ProductCategoryPipe],
  template: `
    <aside class="surface rounded-3 p-3">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h2 class="h5 mb-0">Categories</h2>
        <button class="btn btn-sm btn-link text-decoration-none" type="button" (click)="resetFilters()">
          Reset
        </button>
      </div>

      <div class="list-group list-group-flush">
        <button
          class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          type="button"
          [class.active]="!selectedCategory"
          (click)="categoryChange.emit('')"
        >
          All products
          <i class="bi bi-grid" aria-hidden="true"></i>
        </button>
        <button
          *ngFor="let category of categories"
          class="list-group-item list-group-item-action text-start"
          type="button"
          [class.active]="selectedCategory === category"
          (click)="categoryChange.emit(category)"
        >
          {{ category | productCategory }}
        </button>
      </div>

      <div class="border-top mt-4 pt-4">
        <div class="d-flex align-items-center justify-content-between">
          <h3 class="h6 mb-0">Max price</h3>
          <span class="small text-muted-app">{{ selectedMaxPrice | currency: 'USD' : 'symbol' : '1.0-0' }}</span>
        </div>
        <label class="visually-hidden" for="maxPrice">Maximum product price</label>
        <input
          id="maxPrice"
          class="form-range mt-3"
          type="range"
          [min]="minPrice"
          [max]="maxPrice"
          [step]="5"
          [ngModel]="selectedMaxPrice"
          (ngModelChange)="priceChange.emit($event)"
        />
        <div class="d-flex justify-content-between small text-muted-app">
          <span>{{ minPrice | currency: 'USD' : 'symbol' : '1.0-0' }}</span>
          <span>{{ maxPrice | currency: 'USD' : 'symbol' : '1.0-0' }}</span>
        </div>
      </div>

      <div class="border-top mt-4 pt-4">
        <h3 class="h6 mb-3">Minimum rating</h3>
        <div class="rating-options" role="group" aria-label="Minimum rating">
          <button
            class="btn btn-sm"
            type="button"
            *ngFor="let rating of ratingOptions"
            [class.btn-brand]="selectedMinRating === rating"
            [class.btn-outline-secondary]="selectedMinRating !== rating"
            (click)="ratingChange.emit(rating)"
          >
            {{ rating === 0 ? 'Any' : rating + '+' }}
            <i *ngIf="rating > 0" class="bi bi-star-fill text-warning ms-1" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </aside>
  `,
  styles: [
    `
      .rating-options {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
    `
  ]
})
export class FilterSidebarComponent {
  readonly ratingOptions = [0, 3, 4, 4.5];

  @Input() categories: string[] = [];
  @Input() selectedCategory = '';
  @Input() minPrice = 0;
  @Input() maxPrice = 1000;
  @Input() selectedMaxPrice = 1000;
  @Input() selectedMinRating = 0;
  @Output() categoryChange = new EventEmitter<string>();
  @Output() priceChange = new EventEmitter<number>();
  @Output() ratingChange = new EventEmitter<number>();
  @Output() reset = new EventEmitter<void>();

  resetFilters(): void {
    this.reset.emit();
  }
}
