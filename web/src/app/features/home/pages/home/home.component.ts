import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { Category, ProductDoc } from '../../../../core/types';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ProductService } from '../../../../shared/services/product/product.service';
import { CarrouselComponent } from '../../components/carrousel/carrousel.component';
import { HomeCategoriesComponent } from '../../components/home-categories/home-categories.component';
import { InfoBlockComponent } from '../../components/info-block/info-block.component';
import { NewArrivalsSectionComponent } from '../../components/new-arrivals-section/new-arrivals-section.component';

@Component({
  selector: 'app-home',
  imports: [
    CarrouselComponent,
    HomeCategoriesComponent,
    InfoBlockComponent,
    NewArrivalsSectionComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  categoryItems: MenuItem[] = [];
  categoriesOnDisplay: Category[] = [];
  newProducts: ProductDoc[] = [];

  hasLoadedCarousel = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    private productService: ProductService,
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initHome();
    }
  }

  async initHome() {
    this.newProducts = await this.productService.getNewlyAddedProducts();
  }
}
