import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Button } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { Observable } from 'rxjs';

import { CartProduct, StoreType } from '../../../core/types';
import { convertPriceToFloat } from '../../common';
import {
  changeProductQuantity,
  removeProductFromCart,
} from '../../reducers/shopping-cart/shopping-cart.actions';

@Component({
  selector: 'app-shopping-cart',
  imports: [
    Button,
    CurrencyPipe,
    NgIf,
    NgFor,
    InputNumber,
    FormsModule,
    AsyncPipe,
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent {
  @Output() isShoppingCartVisibleEmitter = new EventEmitter<boolean>();

  shoppingCart$: Observable<CartProduct[]>;

  cartProducts: CartProduct[] = [];
  totalCartProducts = 0;
  cartPriceTotal = 0;

  calculateProductTotalPrice(product: CartProduct) {
    return product.quantity * product.price;
  }

  constructor(private store: Store<StoreType>) {
    this.shoppingCart$ = this.store.select('shoppingCart');
    this.shoppingCart$.subscribe((cart) => {
      this.cartPriceTotal = cart.reduce(
        (acc, curr) => acc + curr.price * curr.quantity,
        0,
      );
    });
  }

  removeProductFromCart(product: CartProduct) {
    this.store.dispatch(() => removeProductFromCart({ product }));
  }

  updateProductQuantity(product: CartProduct, quantity: number) {
    this.store.dispatch(() => changeProductQuantity({ product, quantity }));
  }

  protected readonly convertPriceToFloat = convertPriceToFloat;
}
