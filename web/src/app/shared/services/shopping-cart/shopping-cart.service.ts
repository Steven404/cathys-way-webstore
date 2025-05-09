import { computed, Injectable, signal } from '@angular/core';

import { ProductDoc } from '../../../core/types';

type CartProduct = ProductDoc & { selectedColour?: string };

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  cartProducts = signal<CartProduct[]>([]);
  cartProductsTotal = computed(() => this.cartProducts().length);

  constructor() {}

  addProductToCart(product: CartProduct) {
    this.cartProducts.update((items) => [...items, product]);
  }

  removeProductFromCart(product: CartProduct) {
    const itemToRemoveIndex = this.cartProducts().findIndex(
      (p) => p.id === product.id,
    );

    const newCartArray = this.cartProducts().splice(itemToRemoveIndex, 1);

    this.cartProducts.update(() => newCartArray);
  }
}
