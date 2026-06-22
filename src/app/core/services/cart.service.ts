import { computed, effect, Injectable, signal } from '@angular/core';

import { STORAGE_KEYS } from '../constants/storage-keys';
import { CartItem } from '../../models/cart-item.model';
import { Product } from '../../models/product.model';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<CartItem[]>(this.storage.getItem<CartItem[]>(STORAGE_KEYS.cart, []));
  readonly totalItems = computed(() => this.items().reduce((total, item) => total + item.quantity, 0));
  readonly subtotal = computed(() =>
    this.items().reduce((total, item) => total + item.product.price * item.quantity, 0)
  );

  constructor(
    private readonly storage: StorageService,
    private readonly toast: ToastService
  ) {
    effect(() => this.storage.setItem(STORAGE_KEYS.cart, this.items()));
  }

  add(product: Product): void {
    this.items.update((items) => {
      const existingItem = items.find((item) => item.product.id === product.id);
      if (existingItem) {
        return items.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...items, { product, quantity: 1 }];
    });
    this.toast.show('Added to cart');
  }

  remove(productId: number): void {
    this.items.update((items) => items.filter((item) => item.product.id !== productId));
    this.toast.show('Removed from cart', 'info');
  }

  increment(productId: number): void {
    this.items.update((items) =>
      items.map((item) => (item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item))
    );
  }

  decrement(productId: number): void {
    this.items.update((items) =>
      items
        .map((item) => (item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  }

  updateNote(productId: number, note: string): void {
    this.items.update((items) =>
      items.map((item) => (item.product.id === productId ? { ...item, note: note.trimStart() } : item))
    );
  }

  clear(): void {
    this.items.set([]);
    this.toast.show('Cart cleared', 'info');
  }
}
