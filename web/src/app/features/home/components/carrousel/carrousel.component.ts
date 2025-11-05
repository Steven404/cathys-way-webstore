import { NgIf, NgOptimizedImage } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Carousel, CarouselModule } from 'primeng/carousel';

interface ImageData {
  imageSrc: string;
  text: string;
  alt: string;
}

@Component({
  selector: 'app-carrousel',
  imports: [CarouselModule, NgIf, NgOptimizedImage],
  templateUrl: './carrousel.component.html',
  styleUrl: './carrousel.component.scss',
  host: { ngSkipHydration: 'true' },
})
export class CarrouselComponent {
  @Output() carouselLoadedEmitter = new EventEmitter<boolean>();
  loadedImages = 0;

  nextSlide(carousel: Carousel, event) {
    carousel.navForward(event as TouchEvent);
  }

  previousSlide(carousel: Carousel, event) {
    carousel.navBackward(event as TouchEvent);
  }

  test(carousel: Carousel, event) {
    carousel.onTouchMove(event as TouchEvent);
  }

  imageLoaded() {
    this.loadedImages += 1;
    if (this.loadedImages === this.images.length) {
      this.carouselLoadedEmitter.emit(true);
    }
  }

  images: ImageData[] = [
    {
      imageSrc: 'assets/cover.jpg',
      text: 'Έφτασαν τα Καλοκαιρινά Κοσμήματα',
      alt: 'test',
    },
    {
      imageSrc: 'assets/main_placeholder2.jpg',
      text: 'Χειροποίητα Κοσμήματα Mijuki',
      alt: 'test',
    },
  ];
}
