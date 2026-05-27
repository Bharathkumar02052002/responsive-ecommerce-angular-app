import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <label class="visually-hidden" [for]="inputId">{{ label }}</label>
    <div class="input-group search-shell">
      <span class="input-group-text bg-transparent border-end-0">
        <i class="bi bi-search" aria-hidden="true"></i>
      </span>
      <input
        class="form-control border-start-0"
        type="search"
        [id]="inputId"
        [placeholder]="placeholder"
        [formControl]="searchControl"
      />
      <button
        *ngIf="searchControl.value"
        class="btn btn-outline-secondary"
        type="button"
        (click)="clear()"
        aria-label="Clear search"
      >
        <i class="bi bi-x-lg" aria-hidden="true"></i>
      </button>
    </div>
  `,
  styles: [
    `
      .search-shell .form-control,
      .search-shell .input-group-text,
      .search-shell .btn {
        min-height: 44px;
      }
    `
  ]
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Input() inputId = 'product-search';
  @Input() label = 'Search products';
  @Input() placeholder = 'Search by product name';
  @Input() set value(value: string) {
    this.searchControl.setValue(value, { emitEvent: false });
  }

  @Output() searchChange = new EventEmitter<string>();

  readonly searchControl = new FormControl('', { nonNullable: true });
  private subscription?: Subscription;

  ngOnInit(): void {
    this.subscription = this.searchControl.valueChanges
      .pipe(debounceTime(250), distinctUntilChanged())
      .subscribe((value) => this.searchChange.emit(value));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  clear(): void {
    this.searchControl.setValue('');
  }
}
