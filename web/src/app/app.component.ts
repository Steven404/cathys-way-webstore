import { Component, OnInit } from '@angular/core';

import { Category } from '../../../commonTypes';
import { CategoriesComponent } from './categories/categories.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { ApiService } from './shared/services/api/api.service';
import { WelcomeBoxComponent } from './welcome-box/welcome-box.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, WelcomeBoxComponent, CategoriesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'cathys-way-webstore';
  categories: Category[] = [];

  constructor(private ApiService: ApiService) {}

  ngOnInit() {
    this.ApiService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.categories;
      },
    });
  }
}
