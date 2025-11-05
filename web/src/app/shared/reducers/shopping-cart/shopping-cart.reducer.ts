import { createReducer, on } from '@ngrx/store';

import { CartProduct } from '../../../core/types';
import {
  addProductToCart,
  changeProductQuantity,
  clearCart,
  initCart,
  removeProductFromCart,
} from './shopping-cart.actions';

export const initialState: CartProduct[] = [];

export const shoppingCartReducer = createReducer(
  initialState,
  on(initCart, (_state, { cart }) => [...cart]),
  on(addProductToCart, (state, { product }) => {
    const productExistsInCart = state.some(
      (p) => p.id === product.id && product.selectedColour === p.selectedColour,
    );

    return productExistsInCart ? state : [...state, product];
  }),
  on(removeProductFromCart, (state, { product }) =>
    state.filter((v) => {
      if (product.selectedColour) {
        return !(
          v.id === product.id && v.selectedColour === product.selectedColour
        );
      } else {
        return v.id !== product.id;
      }
    }),
  ),
  on(changeProductQuantity, (state, { product, quantity }) => [
    ...state.map((item) =>
      item.id === product.id && item.selectedColour === product.selectedColour
        ? { ...item, quantity }
        : item,
    ),
  ]),
  on(clearCart, () => []),
);
