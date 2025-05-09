import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMouseSwipe]',
})
export class MouseSwipeDirective {
  private isDragging = false;
  private startX = 0;
  private threshold = 50; // Minimum distance in px to count as a swipe

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.clientX;
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (!this.isDragging) return;
    this.isDragging = false;

    const deltaX = event.clientX - this.startX;

    if (Math.abs(deltaX) > this.threshold) {
      const eventType = deltaX < 0 ? 'swipeleft' : 'swiperight';
      const swipeEvent = new CustomEvent(eventType, { bubbles: true });
      this.el.nativeElement.dispatchEvent(swipeEvent);
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    // Optional: Add dragging visual feedback if needed
  }
}
