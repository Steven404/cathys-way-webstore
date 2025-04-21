import { Routes } from '@angular/router';

import { adminAuthGuard, loginAuthGuard } from './core/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/pages/home/home.component').then(
        (m) => m.HomeComponent,
      ),
  },
  {
    path: 'category/:id',
    loadComponent: () =>
      import(
        './features/categories/pages/category-view/category-view.component'
      ).then((m) => m.CategoryViewComponent),
  },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  {
    path: 'product/:id',
    loadComponent: () =>
      import(
        './features/product/pages/product-view/product-view.component'
      ).then((m) => m.ProductViewComponent),
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./features/admin/pages/login/login.component').then(
        (m) => m.LoginComponent,
      ),
    canActivate: [loginAuthGuard],
  },
  { path: 'admin', redirectTo: 'admin/login', pathMatch: 'full' },
  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./features/admin/pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
    canActivate: [adminAuthGuard],
  },
];
