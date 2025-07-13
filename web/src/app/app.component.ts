import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { Observable } from 'rxjs';

import { CartPersistenceServiceService } from './core/services/cart-persistence-service/cart-persistence-service.service';
import { CartProduct, StoreType } from './core/types';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { CategoryService } from './shared/services/category/category.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Toast, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'cathys-way-webstore';

  shoppingCart$: Observable<CartProduct[]>;

  categoryItems: MenuItem[] = [];
  constructor(
    private categoryService: CategoryService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    private store: Store<StoreType>,
    private cartPersistenceServiceService: CartPersistenceServiceService,
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

    this.cartPersistenceServiceService.initCartFromStorage();
    this.cartPersistenceServiceService.subscribeCartChangesToLocalStorage();
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
