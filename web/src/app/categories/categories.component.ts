import { NgForOf } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Category } from '../../../../commonTypes';

@Component({
  selector: 'app-categories',
  imports: [NgForOf],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  standalone: true,
})
export class CategoriesComponent {
  @Input() categories: Category[] = [];
}
