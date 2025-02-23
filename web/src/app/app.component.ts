import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Category } from '../../../commonTypes';
import { HeaderComponent } from './shared/components/header/header.component';
import { ApiService } from './shared/services/api/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'cathys-way-webstore';

  categories: Category[] = [];

  constructor(private apiService: ApiService) {
    this.apiService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.categories;
      },
    });
  }
}
