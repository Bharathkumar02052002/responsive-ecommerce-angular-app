import { computed, effect, Injectable, signal } from '@angular/core';

import { Product } from '../../models/product.model';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class CompareService {
  readonly items = signal<Product[]>(this.storage.getItem<Product[]>(STORAGE_KEYS.compare, []));
  readonly count = computed(() => this.items().length);
  readonly isFull = computed(() => this.items().length >= 3);

  constructor(
    private readonly storage: StorageService,
    private readonly toast: ToastService
  ) {
    effect(() => this.storage.setItem(STORAGE_KEYS.compare, this.items()));
  }

  has(productId: number): boolean {
    return this.items().some((product) => product.id === productId);
  }

  toggle(product: Product): void {
    if (this.has(product.id)) {
      this.remove(product.id);
      return;
    }

    if (this.isFull()) {
      this.toast.show('Compare list supports up to 3 products', 'warning');
      return;
    }

    this.items.update((items) => [...items, product]);
    this.toast.show('Added to compare');
  }

  remove(productId: number): void {
    this.items.update((items) => items.filter((product) => product.id !== productId));
    this.toast.show('Removed from compare', 'info');
  }

  clear(): void {
    this.items.set([]);
    this.toast.show('Compare list cleared', 'info');
  }
}
