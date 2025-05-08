import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { Category } from '../../../../core/types';
import { CategoryService } from '../../../../shared/services/category/category.service';
import { CarrouselComponent } from '../../components/carrousel/carrousel.component';

@Component({
  selector: 'app-home',
  imports: [CarrouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  categoryItems: MenuItem[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.categories = await this.categoryService.getCategories();
    this.categories.forEach((c) =>
      this.categoryItems.push({
        label: c.name,
        command: (event) => this.router.navigate([`category/${c.id}`]),
      }),
    );
  }
}
