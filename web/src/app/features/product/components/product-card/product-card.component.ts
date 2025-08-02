import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ProductDoc } from '../../../../core/types';
import { convertPriceToFloat } from '../../../../shared/common';

@Component({
  selector: 'app-product-card',
  imports: [NgOptimizedImage],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  standalone: true,
})
export class ProductCardComponent {
  @Input() product: ProductDoc;
  @Input() imageSrc = '';

  isImageLoading = true;

  constructor(private router: Router) {}

  goToProduct() {
    this.router.navigate(['product/' + this.product.id]);
  }

  protected readonly convertPriceToFloat = convertPriceToFloat;
}
