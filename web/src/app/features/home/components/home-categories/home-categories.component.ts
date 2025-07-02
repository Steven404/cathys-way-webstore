import { NgFor, NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Category } from '../../../../core/types';

@Component({
  selector: 'app-home-categories',
  imports: [NgFor, NgOptimizedImage],
  templateUrl: './home-categories.component.html',
  styleUrl: './home-categories.component.scss',
  standalone: true,
})
export class HomeCategoriesComponent {
  @Input() categories: Category[] = [];

  //TODO: Make this dynamically loaded and make it controllable from admin panel

  staticCategories: Category[] = [
    {
      name: 'Κρεμαστά',
      id: '1bOv1gk55RCkGdwncDOH',
      description: '',
      image: 'assets/necklaces.jpg',
    },
    {
      name: 'Κολιέ',
      id: 'OtbAtrrgYYHaxloF0keX',
      description: '',
      image: 'assets/necklaces.jpg',
    },
    {
      name: 'Χειροπέδες',
      id: 'QG6pjKQsTuAdkZL9GYWc',
      description: '',
      image: 'assets/bracelets.jpg',
    },
    {
      name: 'Σκουλαρίκια',
      id: 'YcQsJ5IJwomWZwwrmKTZ',
      description: '',
      image: 'assets/earrings.jpg',
    },
  ];

  constructor(private router: Router) {}

  navigateToCategory(category: Category) {
    this.router.navigate([`category/${category.id}`]);
  }
}
