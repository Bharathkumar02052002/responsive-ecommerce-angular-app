import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="empty-state surface rounded-3 text-center">
      <i class="bi {{ icon }} empty-icon" aria-hidden="true"></i>
      <h2 class="h4 mt-3">{{ title }}</h2>
      <p class="text-muted-app mb-4">{{ message }}</p>
      <a *ngIf="actionLabel" class="btn btn-brand" [routerLink]="actionLink">{{ actionLabel }}</a>
    </section>
  `,
  styles: [
    `
      .empty-state {
        padding: 3rem 1.5rem;
      }

      .empty-icon {
        color: var(--app-primary);
        font-size: 3rem;
      }
    `
  ]
})
export class EmptyStateComponent {
  @Input() title = 'Nothing here yet';
  @Input() message = 'Explore products and come back when you are ready.';
  @Input() icon = 'bi-bag';
  @Input() actionLabel = 'Browse products';
  @Input() actionLink = '/products';
}
