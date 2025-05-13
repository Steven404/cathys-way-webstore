import { computed, Injectable, signal } from '@angular/core';

import { CartProduct } from '../../../core/types';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  cartProducts = signal<CartProduct[]>([
    {
      selectedColour: 'Χρυσό',
      id: '5k0L3l8JWbTDTpPxSzdm',
      code: 'ΣΚ-025',
      name: 'Ρόμβος Μάτι',
      mainImageUrl:
        'https://firebasestorage.googleapis.com/v0/b/cathys-way.firebasestorage.app/o/products%2F5k0L3l8JWbTDTpPxSzdm%2Fmain-image%2Fpexels-the-glorious-studio-3584518-10983778.jpg?alt=media&token=c8a407a3-e83b-4cf5-b3c0-48079837a15e',
      subCategoryId: 'm9n5NERJSFKiGdnObzQq',
      categoryId: 'YcQsJ5IJwomWZwwrmKTZ',
      price: 14,
      quantity: 1,
    },
  ]);
  totalCartProducts = computed(() => this.cartProducts().length);
  cartPriceTotal = computed(() =>
    this.cartProducts().reduce(
      (acc, curr) => acc + curr.price * curr.quantity,
      0,
    ),
  );

  addProductToCart(product: CartProduct) {
    this.cartProducts.update((items) => [...items, product]);
  }

  removeProductFromCart(product: CartProduct) {
    if (this.totalCartProducts() === 1) {
      this.cartProducts.update(() => []);
      return;
    }
    const itemToRemoveIndex = this.cartProducts().findIndex(
      (p) => p.id === product.id,
    );

    const newCartArray = this.cartProducts().splice(itemToRemoveIndex, 1);

    this.cartProducts.update(() => newCartArray);
  }

  updateProductQuantity(product: CartProduct, newQuantity: number) {
    const cartProducts = this.cartProducts();
    const cartProductChangeIndex = cartProducts.findIndex(
      (v) => product.id === v.id,
    );
    cartProducts[cartProductChangeIndex].quantity = newQuantity;

    this.cartProducts.update(() => cartProducts);
    console.log(this.cartProducts());
    console.log(this.cartPriceTotal());
  }
}
