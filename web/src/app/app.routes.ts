import { Routes } from '@angular/router';

import { CategoryViewComponent } from './category-view/category-view.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'category/:id', component: CategoryViewComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
];
