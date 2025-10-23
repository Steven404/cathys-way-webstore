import {
  AsyncPipe,
  CurrencyPipe,
  NgFor,
  NgIf,
  NgOptimizedImage,
} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { StripeElementsOptions } from '@stripe/stripe-js';
import {
  injectStripe,
  StripeElementsDirective,
  StripePaymentElementComponent,
} from 'ngx-stripe';
import { Button } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { RadioButton } from 'primeng/radiobutton';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { CartProduct, StoreType } from '../../../core/types';
import { convertPriceToFloat } from '../../../shared/common';
import {
  changeProductQuantity,
  clearCart,
  removeProductFromCart,
} from '../../../shared/reducers/shopping-cart/shopping-cart.actions';
import { StripePaymentsService } from '../../../shared/stripe-payments/stripe-payments.service';

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
    StripePaymentElementComponent,
    StripeElementsDirective,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  shoppingCart$: Observable<CartProduct[]>;
  checkoutForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    paymentMethod: ['', Validators.required],
    notes: [''],
  });
  cartPriceTotal = 0;
  isSubmitting = false;

  stripe = injectStripe(environment.stripe.publishable_key);

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
    appearance: {
      theme: 'flat',
    },
  };

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
    private stripePaymentsService: StripePaymentsService,
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
  }

  ngOnInit() {
    this.stripePaymentsService
      .createPaymentIntent(this.cartPriceTotal)
      .subscribe((pi) => {
        this.elementsOptions.clientSecret = pi.client_secret as string;
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
