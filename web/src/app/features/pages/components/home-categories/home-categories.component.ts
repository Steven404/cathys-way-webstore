import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Category } from '../../../../core/types';

@Component({
  selector: 'app-home-categories',
  imports: [NgFor],
  templateUrl: './home-categories.component.html',
  styleUrl: './home-categories.component.scss',
  standalone: true,
})
export class HomeCategoriesComponent {
  @Input() categories: Category[] = [];

  constructor(private router: Router) {}

  navigateToCategory(category) {
    this.router.navigate([`category/${category.id}`]);
  }
}
