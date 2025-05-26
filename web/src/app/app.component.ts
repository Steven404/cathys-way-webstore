import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Toast } from 'primeng/toast';

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

  categoryItems: MenuItem[] = [];
  constructor(
    private categoryService: CategoryService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  get categories() {
    return this.categoryService.categoriesSignal();
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initApp();
    }
  }

  async initApp() {
    await import('hammerjs');
    await this.loadCategories();
  }

  async loadCategories() {
    await this.categoryService.fetchCategories();
    this.categories.forEach((c) =>
      this.categoryItems.push({
        label: c.name,
        command: () => this.router.navigate([`category/${c.id}`]),
      }),
    );
  }
}
