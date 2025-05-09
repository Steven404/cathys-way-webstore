import { animate, style, transition, trigger } from '@angular/animations';
import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Button } from 'primeng/button';
import { GalleriaModule } from 'primeng/galleria';
import { Image } from 'primeng/image';
import { Select } from 'primeng/select';

import { ProductDoc } from '../../../../core/types';
import { convertPriceToFloat } from '../../../../shared/common';
import { ApiService } from '../../../../shared/services/api/api.service';
import { ProductService } from '../../../../shared/services/product/product.service';
import { ShoppingCartService } from '../../../../shared/services/shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-product-view',
  imports: [NgIf, Image, Button, GalleriaModule, Select],
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.scss',
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
export class ProductViewComponent implements OnInit {
  private productService = inject(ProductService);

  id: string;
  product: ProductDoc;

  mainImageSrc = '/assets/rings.jpg';

  images = [];

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private shoppingCartService: ShoppingCartService,
  ) {}

  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      const retrievedDoc = await this.productService.getProduct(this.id);
      this.product = {
        ...retrievedDoc.data(),
        id: retrievedDoc.id,
      } as ProductDoc;
      if (this.product.mainImageUrl) {
        this.mainImageSrc = this.product.mainImageUrl;
      }
      if (this.product.extraImageUrls && this.product.extraImageUrls.length) {
        this.images = [
          this.product.mainImageUrl,
          ...this.product.extraImageUrls,
        ];
      }
    }
  }

  selectedColour = '';

  addProductToCart() {
    let selectedColourObject = {};
    if (
      this.product.colours &&
      this.product.colours.length &&
      !this.selectedColour
    ) {
      return;
    } else {
      selectedColourObject = { selectedColour: this.selectedColour };
    }

    const newCartProduct = { ...this.product, ...selectedColourObject };

    this.shoppingCartService.addProductToCart(newCartProduct);
    console.log(this.shoppingCartService.cartProducts());
  }

  protected readonly convertPriceToFloat = convertPriceToFloat;
}
