import { Component, Input } from '@angular/core';

import { Product } from '../../../../commonTypes';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  standalone: true,
})
export class ProductCardComponent {
  @Input() product: Product;

  convertPriceToFloat(price: number) {
    return price.toFixed(2);
  }
}
