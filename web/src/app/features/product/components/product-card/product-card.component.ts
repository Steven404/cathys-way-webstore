import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ProductDoc } from '../../../../core/types';
import { convertPriceToFloat } from '../../../../shared/common';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-card',
  imports: [NgOptimizedImage, LoadingSpinnerComponent],
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

  test2() {
    this.isImageLoading = false;
  }

  protected readonly convertPriceToFloat = convertPriceToFloat;
}
