import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProductDoc } from '../../../../core/types';
import { convertPriceToFloat } from '../../../../shared/common';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  standalone: true,
})
export class ProductCardComponent implements OnInit {
  @Input() product: ProductDoc;

  constructor(private router: Router) {}

  ngOnInit() {}

  goToProduct() {
    this.router.navigate(['product/' + this.product.id]);
  }

  protected readonly convertPriceToFloat = convertPriceToFloat;
}
