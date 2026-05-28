import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="open" class="modal-backdrop-custom" (click)="close.emit()" aria-hidden="true"></div>
    <section
      *ngIf="open"
      class="modal-panel surface rounded-3"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="title"
    >
      <header class="d-flex align-items-center justify-content-between gap-3 border-bottom p-3">
        <h2 class="h5 mb-0">{{ title }}</h2>
        <button class="btn btn-sm btn-outline-secondary" type="button" (click)="close.emit()" aria-label="Close modal">
          <i class="bi bi-x-lg" aria-hidden="true"></i>
        </button>
      </header>
      <div class="p-3">
        <ng-content />
      </div>
    </section>
  `,
  styles: [
    `
      .modal-backdrop-custom {
        position: fixed;
        inset: 0;
        z-index: 1050;
        background: rgba(16, 24, 40, 0.54);
      }

      .modal-panel {
        position: fixed;
        inset: auto 1rem 1rem 1rem;
        z-index: 1051;
        max-height: calc(100vh - 2rem);
        overflow: auto;
      }

      @media (min-width: 768px) {
        .modal-panel {
          inset: 50% auto auto 50%;
          width: min(620px, calc(100vw - 2rem));
          transform: translate(-50%, -50%);
        }
      }
    `
  ]
})
export class ModalComponent {
  @Input() open = false;
  @Input() title = 'Details';
  @Output() close = new EventEmitter<void>();
}
