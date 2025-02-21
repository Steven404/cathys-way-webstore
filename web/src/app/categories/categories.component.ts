import { NgForOf, NgOptimizedImage } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { Category } from '../../../../commonTypes';

@Component({
  selector: 'app-categories',
  imports: [NgForOf, NgOptimizedImage],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  standalone: true,
})
export class CategoriesComponent implements OnInit {
  @Input() categories: Category[] = [];

  parentCategories: Category[] = [];

  ngOnInit() {
    if (this.categories.length) {
      this.parentCategories = this.categories.filter(
        (category) => !category.parent_id,
      );
    }
  }
}
