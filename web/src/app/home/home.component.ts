import { Component } from '@angular/core';

import { CategoriesComponent } from '../categories/categories.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { WelcomeBoxComponent } from '../welcome-box/welcome-box.component';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, WelcomeBoxComponent, CategoriesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
})
export class HomeComponent {}
