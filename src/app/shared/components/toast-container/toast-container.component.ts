import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-stack" aria-live="polite" aria-atomic="true">
      <div
        *ngFor="let toast of toastService.toasts()"
        class="alert alert-{{ toast.tone }} shadow-sm d-flex align-items-center justify-content-between gap-3 mb-2"
        role="alert"
      >
        <span>{{ toast.message }}</span>
        <button class="btn btn-sm btn-link text-reset p-0" type="button" (click)="toastService.dismiss(toast.id)">
          <span class="visually-hidden">Dismiss</span>
          <i class="bi bi-x-lg" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .toast-stack {
        position: fixed;
        right: 1rem;
        bottom: 1rem;
        z-index: 1100;
        width: min(360px, calc(100vw - 2rem));
      }
    `
  ]
})
export class ToastContainerComponent {
  constructor(readonly toastService: ToastService) {}
}
