import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';

interface ImageData {
  imageSrc: string;
  text: string;
  alt: string;
}

@Component({
  selector: 'app-carrousel',
  imports: [CarouselModule, NgIf],
  templateUrl: './carrousel.component.html',
  styleUrl: './carrousel.component.scss',
})
export class CarrouselComponent {
  images: ImageData[] = [
    {
      imageSrc: '/assets/cover.jpg',
      text: 'Summer Jewels Here Now',
      alt: 'test',
    },
    {
      imageSrc: '/assets/main_placeholder2.jpg',
      text: 'Χειροποίητα Mijuki',
      alt: 'test',
    },
  ];
}
