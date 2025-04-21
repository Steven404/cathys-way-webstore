import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from '../../../../../../../commonTypes';
import { convertPriceToFloat } from '../../../../shared/common';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  standalone: true,
})
export class ProductCardComponent implements OnInit {
  @Input() product: Product;

  constructor(private router: Router) {}

  ngOnInit() {
    if (this.product) {
      console.log(this.product.name);
    }
  }

  goToProduct() {
    this.router.navigate(['product/' + this.product.id]);
  }

  protected readonly convertPriceToFloat = convertPriceToFloat;
}
