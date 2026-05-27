import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="variant === 'spinner'" class="loader-wrap" role="status" aria-live="polite">
      <div class="spinner-border text-success" aria-hidden="true"></div>
      <span class="visually-hidden">{{ label }}</span>
    </div>

    <div *ngIf="variant === 'skeleton'" class="row g-3" aria-hidden="true">
      <div class="col-12 col-sm-6 col-lg-4 col-xl-3" *ngFor="let item of skeletonItems">
        <div class="skeleton-card surface rounded-3 p-3">
          <span class="skeleton-img"></span>
          <span class="skeleton-line w-75"></span>
          <span class="skeleton-line w-50"></span>
          <span class="skeleton-line w-25"></span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .loader-wrap {
        display: grid;
        min-height: 240px;
        place-items: center;
      }

      .skeleton-card {
        min-height: 330px;
      }

      .skeleton-img,
      .skeleton-line {
        display: block;
        border-radius: 8px;
        background: linear-gradient(90deg, var(--app-surface-soft), var(--app-border), var(--app-surface-soft));
        background-size: 220% 100%;
        animation: shimmer 1.3s ease-in-out infinite;
      }

      .skeleton-img {
        height: 180px;
        margin-bottom: 1rem;
      }

      .skeleton-line {
        height: 14px;
        margin-top: 0.8rem;
      }

      @keyframes shimmer {
        to {
          background-position: -220% 0;
        }
      }
    `
  ]
})
export class LoaderComponent {
  @Input() label = 'Loading content';
  @Input() variant: 'spinner' | 'skeleton' = 'spinner';

  readonly skeletonItems = Array.from({ length: 8 });
}
