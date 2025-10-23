import {
  AsyncPipe,
  CurrencyPipe,
  NgFor,
  NgIf,
  NgOptimizedImage,
} from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Button } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { RadioButton } from 'primeng/radiobutton';
import { Observable } from 'rxjs';

import { CartProduct, StoreType } from '../../../core/types';
import { convertPriceToFloat } from '../../../shared/common';
import {
  changeProductQuantity,
  clearCart,
  removeProductFromCart,
} from '../../../shared/reducers/shopping-cart/shopping-cart.actions';

@Component({
  selector: 'app-checkout',
  imports: [
    AsyncPipe,
    NgIf,
    NgFor,
    CurrencyPipe,
    ReactiveFormsModule,
    Button,
    NgOptimizedImage,
    InputNumber,
    FormsModule,
    RadioButton,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  shoppingCart$: Observable<CartProduct[]>;
  checkoutForm: FormGroup;
  cartPriceTotal = 0;
  isSubmitting = false;

  paymentOptions = [
    { label: 'Χρεωστική/Πιστωτική καρτα', value: 'cod' },
    { label: 'IRIS Payment', value: 'card' },
    { label: 'Κατάθεση σε τραπεζικό λογαριασμό', value: 'paypal' },
  ];

  paymentMethod = '';

  constructor(
    private store: Store<StoreType>,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.shoppingCart$ = this.store.select('shoppingCart');

    this.shoppingCart$.subscribe((cart) => {
      this.cartPriceTotal = cart.reduce(
        (acc, curr) => acc + curr.price * curr.quantity,
        0,
      );

      // If cart is empty, redirect to home
      if (cart.length === 0) {
        this.router.navigate(['/']);
      }
    });

    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      notes: [''],
    });
  }

  removeProductFromCart(product: CartProduct) {
    this.store.dispatch(() => removeProductFromCart({ product }));
  }

  updateProductQuantity(product: CartProduct, quantity: number) {
    this.store.dispatch(() => changeProductQuantity({ product, quantity }));
  }

  calculateProductTotalPrice(product: CartProduct) {
    return product.quantity * product.price;
  }

  onSubmit() {
    if (this.checkoutForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      // TODO: Implement actual order submission logic
      console.log('Order submitted:', {
        customerInfo: this.checkoutForm.value,
        cartTotal: this.cartPriceTotal,
      });

      // Clear cart after successful order
      this.store.dispatch(clearCart());

      // Navigate to success page or home
      alert('Η παραγγελία σας ολοκληρώθηκε με επιτυχία!');
      this.router.navigate(['/']);
    }
  }

  protected readonly convertPriceToFloat = convertPriceToFloat;
}
