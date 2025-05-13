import { createReducer, on } from '@ngrx/store';

import { CartProduct } from '../../../core/types';
import {
  addProductToCart,
  changeProductQuantity,
  clearCart,
  removeProductFromCart,
} from './shopping-cart.actions';

export type ShoppingCartState = CartProduct[];

export const initialState: CartProduct[] = [];

export const shoppingCartReducer = createReducer(
  initialState,
  on(addProductToCart, (state, { product }) => {
    if (state.find((p) => p.id === product.id)) {
      return state;
    }

    return [...state, product];
  }),
  on(removeProductFromCart, (state, { product }) =>
    state.filter((v) => v.id !== product.id),
  ),
  on(changeProductQuantity, (state, { productId, quantity }) => [
    ...state.map((item) =>
      item.id === productId ? { ...item, quantity } : item,
    ),
  ]),
  on(clearCart, () => []),
);
