import { computed, effect, Injectable, signal } from '@angular/core';

import { STORAGE_KEYS } from '../constants/storage-keys';
import { Product } from '../../models/product.model';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  readonly items = signal<Product[]>(this.storage.getItem<Product[]>(STORAGE_KEYS.wishlist, []));
  readonly count = computed(() => this.items().length);

  constructor(
    private readonly storage: StorageService,
    private readonly toast: ToastService
  ) {
    effect(() => this.storage.setItem(STORAGE_KEYS.wishlist, this.items()));
  }

  isWishlisted(productId: number): boolean {
    return this.items().some((product) => product.id === productId);
  }

  add(product: Product): void {
    if (this.isWishlisted(product.id)) {
      this.toast.show('Already saved to wishlist', 'info');
      return;
    }

    this.items.update((items) => [...items, product]);
    this.toast.show('Saved to wishlist');
  }

  toggle(product: Product): void {
    if (this.isWishlisted(product.id)) {
      this.items.update((items) => items.filter((item) => item.id !== product.id));
      this.toast.show('Removed from wishlist', 'info');
      return;
    }

    this.add(product);
  }

  remove(productId: number): void {
    this.items.update((items) => items.filter((item) => item.id !== productId));
    this.toast.show('Removed from wishlist', 'info');
  }
}
