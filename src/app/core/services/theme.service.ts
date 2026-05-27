import { effect, Injectable, signal } from '@angular/core';

import { STORAGE_KEYS } from '../constants/storage-keys';
import { StorageService } from './storage.service';

export type AppTheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<AppTheme>(this.storage.getItem<AppTheme>(STORAGE_KEYS.theme, 'light'));

  constructor(private readonly storage: StorageService) {
    effect(() => {
      document.documentElement.setAttribute('data-bs-theme', this.theme());
      this.storage.setItem(STORAGE_KEYS.theme, this.theme());
    });
  }

  toggle(): void {
    this.theme.update((theme) => (theme === 'light' ? 'dark' : 'light'));
  }
}
