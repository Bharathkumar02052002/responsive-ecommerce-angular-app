import { effect, Injectable, signal } from '@angular/core';

import { Product } from '../../models/product.model';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class RecentlyViewedService {
  readonly products = signal<Product[]>(this.storage.getItem<Product[]>(STORAGE_KEYS.recentlyViewed, []));

  constructor(private readonly storage: StorageService) {
    effect(() => this.storage.setItem(STORAGE_KEYS.recentlyViewed, this.products()));
  }

  add(product: Product): void {
    this.products.update((items) => {
      const withoutCurrentProduct = items.filter((item) => item.id !== product.id);
      return [product, ...withoutCurrentProduct].slice(0, 4);
    });
  }
}
