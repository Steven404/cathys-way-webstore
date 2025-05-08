import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Toast } from 'primeng/toast';

import { Category } from './core/types';
import { HeaderComponent } from './shared/components/header/header.component';
import { CategoryService } from './shared/services/category/category.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Toast, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'cathys-way-webstore';

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
