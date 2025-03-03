import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from '../../../../../../../commonTypes';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  standalone: true,
})
export class ProductCardComponent {
  @Input() product: Product;

  constructor(private router: Router) {}

  goToProduct() {
    this.router.navigate(['product/' + this.product.id]);
  }

  convertPriceToFloat(price: number) {
    return price.toFixed(2);
  }
}
