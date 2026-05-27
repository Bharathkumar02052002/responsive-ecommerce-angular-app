import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[appImageFallback]',
  standalone: true
})
export class ImageFallbackDirective {
  @Input() appImageFallback = 'assets/image-placeholder.svg';

  @HostListener('error', ['$event'])
  onError(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.src = this.appImageFallback;
  }
}
