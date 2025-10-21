import { animate, style, transition, trigger } from '@angular/animations';
import { NgForOf, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Button } from 'primeng/button';

import { ProductDoc } from '../../../../core/types';
import { ProductService } from '../../../../shared/services/product/product.service';
import { ProductCardComponent } from '../../../product/components/product-card/product-card.component';

@Component({
  selector: 'app-new-arrivals',
  standalone: true,
  imports: [NgIf, NgForOf, ProductCardComponent, Button],
  templateUrl: './new-arrivals.component.html',
  styleUrl: './new-arrivals.component.scss',
  animations: [
    trigger('fadeInFadeOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class NewArrivalsComponent implements OnInit {
  productService = inject(ProductService);
  products: ProductDoc[] = [];
  totalProductsCount = 0;
  firstProductIndex = 1;
  lastProductIndex = 9;
  pages: number[] = [];
  activePage = 1;
  isLoading = false;
  ngOnInit() {
    this.getProductsInit();
  }
  async getProductsInit() {
    this.isLoading = true;
    try {
      const retrievedProducts =
        await this.productService.getNewlyAddedProducts(9);
      this.products = retrievedProducts;
      this.totalProductsCount = retrievedProducts.length;
      if (this.totalProductsCount < 9) {
        this.lastProductIndex = this.totalProductsCount;
      }
      // Calculate pages number (though with only 9 products, we'll have just 1 page)
      [...Array(Math.ceil(this.totalProductsCount / 9)).keys()].forEach((v) =>
        this.pages.push(v + 1),
      );
    } catch (e) {
      console.log(e);
    } finally {
      this.isLoading = false;
    }
  }
  protected readonly String = String;
}
