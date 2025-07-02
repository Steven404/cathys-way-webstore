import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { Category } from '../../../../core/types';
import { CarrouselComponent } from '../../components/carrousel/carrousel.component';
import { HomeCategoriesComponent } from '../../components/home-categories/home-categories.component';
import { InfoBlockComponent } from '../../components/info-block/info-block.component';
import { NewItemsComponent } from '../../components/new-items/new-items.component';

@Component({
  selector: 'app-home',
  imports: [
    CarrouselComponent,
    HomeCategoriesComponent,
    InfoBlockComponent,
    NewItemsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  categories: Category[] = [];
  categoryItems: MenuItem[] = [];
  categoriesOnDisplay: Category[] = [];

  constructor(private router: Router) {}
}
