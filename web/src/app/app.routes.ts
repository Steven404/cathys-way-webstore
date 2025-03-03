import { Routes } from '@angular/router';

import { CategoryViewComponent } from './features/categories/pages/category-view/category-view.component';
import { HomeComponent } from './features/home/pages/home/home.component';
import { ProductViewComponent } from './features/product/pages/product-view/product-view.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'category/:id', component: CategoryViewComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'product/:id', component: ProductViewComponent },
];
