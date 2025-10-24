import { animate, style, transition, trigger } from '@angular/animations';
import {
  AsyncPipe,
  CurrencyPipe,
  NgFor,
  NgIf,
  NgOptimizedImage,
} from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  StripeAddressElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { injectStripe, StripeService } from 'ngx-stripe';
import { Button } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { RadioButton } from 'primeng/radiobutton';
import { Observable, switchMap } from 'rxjs';

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
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  animations: [
    trigger('fadeInFadeOut', [
      transition(':enter', [
        style({ opacity: 0, height: 0, marginTop: 0, overflow: 'hidden' }),
        animate(
          '300ms ease-in-out',
          style({ opacity: 1, height: '*', marginTop: '*' }),
        ),
      ]),
      transition(':leave', [
        style({ overflow: 'hidden' }),
        animate(
          '300ms ease-in-out',
          style({ opacity: 0, height: 0, marginTop: 0 }),
        ),
      ]),
    ]),
  ],
})
export class CheckoutComponent {
  shoppingCart$: Observable<CartProduct[]>;
  checkoutForm: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    paymentMethod: new FormControl('', Validators.required),
    notes: new FormControl(''),
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
    { label: 'Χρεωστική/Πιστωτική καρτα *', value: 'card' },
    { label: 'IRIS Payment', value: 'iris' },
    { label: 'Κατάθεση σε τραπεζικό λογαριασμό', value: 'paypal' },
  ];

  billingAddressOptions: StripeAddressElementOptions = {
    mode: 'billing',
  };

  constructor(
    private store: Store<StoreType>,
    private router: Router,
    private stripePaymentsService: StripePaymentsService,
    private stripeService: StripeService,
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

  removeProductFromCart(product: CartProduct) {
    this.store.dispatch(() => removeProductFromCart({ product }));
  }

  updateProductQuantity(product: CartProduct, quantity: number) {
    this.store.dispatch(() => changeProductQuantity({ product, quantity }));
  }

  calculateProductTotalPrice(product: CartProduct) {
    return product.quantity * product.price;
  }

  checkout() {
    this.stripePaymentsService
      .createCheckoutSession(
        this.cartPriceTotal * 100,
        this.checkoutForm.controls['email'].value,
      )
      .pipe(
        switchMap((session) => {
          return this.stripeService.redirectToCheckout({
            sessionId: session.sessionId,
          });
        }),
      )
      .subscribe((result) => {
        // If `redirectToCheckout` fails due to a browser or network
        // error, you should display the localized error message to your
        // customer using `error.message`.
        if (result.error) {
          alert(result.error.message);
        }
      });

    return;
    if (this.checkoutForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

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
