import { animate, style, transition, trigger } from '@angular/animations';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Button } from 'primeng/button';
import { GalleriaModule } from 'primeng/galleria';
import { Select, SelectChangeEvent } from 'primeng/select';
import { first, Observable } from 'rxjs';

import { CartProduct, ProductDoc, StoreType } from '../../../../core/types';
import { convertPriceToFloat } from '../../../../shared/common';
import { addProductToCart } from '../../../../shared/reducers/shopping-cart/shopping-cart.actions';
import { ApiService } from '../../../../shared/services/api/api.service';
import { ProductService } from '../../../../shared/services/product/product.service';

@Component({
  selector: 'app-product-view',
  imports: [NgIf, Button, GalleriaModule, Select, NgOptimizedImage],
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
  isLoading = false;

  shoppingCart$: Observable<CartProduct[]>;

  errorCode = '';

  id: string;
  product: ProductDoc;

  mainImageSrc = '/assets/rings.jpg';

  images = [];

  isProductInCart = false;

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private store: Store<StoreType>,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.getProductInfo().then(() => this.initPage());
    this.activatedRoute.params.subscribe((value) => {
      if (this.id && value && value['id'] !== this.id) {
        window.location.reload();
      }
    });
  }

  async getProductInfo() {
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

  initPage() {
    this.subscribeToCart();
  }

  subscribeToCart() {
    this.shoppingCart$ = this.store.select('shoppingCart');
    this.shoppingCart$.subscribe((value) => {
      if (value) {
        this.isProductInCart = value.some(
          (v) =>
            v.id === this.product.id &&
            v.selectedColour === this.selectedColour,
        );
      }
    });
  }

  selectedColour = '';

  colourSelected(event: SelectChangeEvent) {
    this.selectedColour = event.value;
    this.errorCode = '';
    this.shoppingCart$.pipe(first()).subscribe((value) => {
      this.isProductInCart = value.some(
        (v) =>
          v.id === this.product.id && v.selectedColour === this.selectedColour,
      );
    });
  }

  async addProductToCart() {
    let selectedColourObject = { selectedColour: '' };
    if (
      this.product.colours &&
      this.product.colours.length &&
      !this.selectedColour
    ) {
      this.errorCode = 'Παρακαλώ επιλέξτε χρώμα';
      return;
    } else {
      selectedColourObject = { selectedColour: this.selectedColour };
    }

    this.errorCode = '';

    this.isLoading = true;

    const newCartProduct: CartProduct = {
      ...selectedColourObject,
      id: this.product.id,
      code: this.product.code,
      name: this.product.name,
      mainImageUrl: this.product.mainImageUrl,
      subCategoryId: this.product.subCategoryId,
      categoryId: this.product.categoryId,
      price: parseFloat(String(this.product.price)),
      quantity: 1,
    };

    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    this.store.dispatch(() => addProductToCart({ product: newCartProduct }));
    this.isLoading = false;
  }

  protected readonly convertPriceToFloat = convertPriceToFloat;
}
