import { Component } from '@angular/core';

import { Category } from '../../../../commonTypes';
import { CategoriesComponent } from '../categories/categories.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { ApiService } from '../shared/services/api/api.service';
import { WelcomeBoxComponent } from '../welcome-box/welcome-box.component';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, WelcomeBoxComponent, CategoriesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
})
export class HomeComponent {
  categories: Category[] = [];

  constructor(private apiService: ApiService) {
    this.apiService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.categories;
      },
    });
  }
}
