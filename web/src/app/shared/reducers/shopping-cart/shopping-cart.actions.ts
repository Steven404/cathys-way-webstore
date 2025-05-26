import { createAction, props } from '@ngrx/store';

import { CartProduct } from '../../../core/types';

export const initCart = createAction(
  '[Shopping Cart] Init cart',
  props<{ cart: CartProduct[] }>(),
);
export const addProductToCart = createAction(
  '[Shopping Cart] Add product to cart',
  props<{ product: CartProduct }>(),
);

export const removeProductFromCart = createAction(
  '[Shopping Cart] Remove product from cart',
  props<{ product: CartProduct }>(),
);
export const changeProductQuantity = createAction(
  '[Shopping Cart] Change product quantity on cart',
  props<{ product: CartProduct; quantity: number }>(),
);
export const clearCart = createAction('[Shopping Cart] Clear Product Cart');
