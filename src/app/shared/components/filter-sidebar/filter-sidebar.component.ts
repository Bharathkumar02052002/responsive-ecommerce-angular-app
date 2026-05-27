import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductCategoryPipe } from '../../pipes/product-category.pipe';

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [CommonModule, ProductCategoryPipe],
  template: `
    <aside class="surface rounded-3 p-3">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h2 class="h5 mb-0">Categories</h2>
        <button class="btn btn-sm btn-link text-decoration-none" type="button" (click)="categoryChange.emit('')">
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
    </aside>
  `
})
export class FilterSidebarComponent {
  @Input() categories: string[] = [];
  @Input() selectedCategory = '';
  @Output() categoryChange = new EventEmitter<string>();
}
