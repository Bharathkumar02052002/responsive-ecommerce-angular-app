import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

interface Crumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav *ngIf="crumbs().length" class="container pt-3" aria-label="Breadcrumb">
      <ol class="breadcrumb small mb-0">
        <li class="breadcrumb-item"><a routerLink="/">Home</a></li>
        <li
          *ngFor="let crumb of crumbs(); let last = last"
          class="breadcrumb-item"
          [class.active]="last"
          [attr.aria-current]="last ? 'page' : null"
        >
          <a *ngIf="!last" [routerLink]="crumb.url">{{ crumb.label }}</a>
          <span *ngIf="last">{{ crumb.label }}</span>
        </li>
      </ol>
    </nav>
  `
})
export class BreadcrumbComponent {
  private readonly currentUrl = signal(this.router.url);
  readonly crumbs = computed(() => this.createCrumbs(this.currentUrl()));

  constructor(private readonly router: Router) {
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event) => {
      this.currentUrl.set(event.urlAfterRedirects);
    });
  }

  private createCrumbs(url: string): Crumb[] {
    const path = url.split('?')[0];
    if (path === '/') {
      return [];
    }

    const segments = path.split('/').filter(Boolean);
    return segments.map((segment, index) => ({
      label: Number.isNaN(Number(segment)) ? this.toLabel(segment) : 'Details',
      url: `/${segments.slice(0, index + 1).join('/')}`
    }));
  }

  private toLabel(segment: string): string {
    return segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
