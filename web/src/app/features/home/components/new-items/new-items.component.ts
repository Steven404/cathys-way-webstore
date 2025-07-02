import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductDoc } from '../../../../core/types';
import { ProductService } from '../../../../shared/services/product/product.service';

@Component({
  selector: 'app-new-items',
  imports: [],
  templateUrl: './new-items.component.html',
  styleUrl: './new-items.component.scss',
})
export class NewItemsComponent implements OnInit {
  products$: Observable<ProductDoc[]>;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProduct('pNTfvYxjquNZQoEMVh9q');
  }

  async getProducts() {
    try {
      // this.products = newProductsData.products;
    } catch (e) {
      console.log(e);
    }
  }
}
