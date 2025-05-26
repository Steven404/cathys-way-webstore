import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { Category } from '../../../../core/types';
import { CategoryService } from '../../../../shared/services/category/category.service';
import { HomeCategoriesComponent } from '../../../pages/components/home-categories/home-categories.component';
import { CarrouselComponent } from '../../components/carrousel/carrousel.component';
import { InfoBlockComponent } from '../../components/info-block/info-block.component';

@Component({
  selector: 'app-home',
  imports: [CarrouselComponent, HomeCategoriesComponent, InfoBlockComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  categoryItems: MenuItem[] = [];
  categoriesOnDisplay: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router,
  ) {}

  async ngOnInit() {
    // this.categories = await this.categoryService.getCategories();
    // this.categoriesOnDisplay = this.categories.filter((_v, i) => i < 4);
    // this.categories.forEach((c) =>
    //   this.categoryItems.push({
    //     label: c.name,
    //     command: () => this.router.navigate([`category/${c.id}`]),
    //   }),
    // );
  }
}
