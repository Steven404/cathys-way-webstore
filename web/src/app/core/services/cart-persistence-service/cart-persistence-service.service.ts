import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { initCart } from '../../../shared/reducers/shopping-cart/shopping-cart.actions';
import { StoreType } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class CartPersistenceServiceService {
  constructor(private store: Store<StoreType>) {}

  initCartFromStorage() {
    const cart = localStorage.getItem('cart');
    if (typeof window !== 'undefined') {
      if (cart != undefined && cart !== '[]') {
        const parsedCart = JSON.parse(cart);

        this.store.dispatch(() => initCart({ cart: parsedCart }));
      }
    }
  }

  subscribeCartChangesToLocalStorage() {
    this.store.select('shoppingCart').subscribe((value) => {
      if (typeof window !== 'undefined' && value) {
        localStorage.setItem('cart', JSON.stringify(value));
      }
    });
  }
}
