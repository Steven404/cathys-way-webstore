import { animate, style, transition, trigger } from '@angular/animations';
import {
  AsyncPipe,
  CurrencyPipe,
  NgFor,
  NgIf,
  NgOptimizedImage,
} from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { injectStripe, StripeService } from 'ngx-stripe';
import { Button } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { RadioButton } from 'primeng/radiobutton';
import { firstValueFrom, Observable, Subscription, take } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { environment } from '../../../../environments/environment';
import { CartProduct, StoreType } from '../../../core/types';
import {
  convertPriceToFloat,
  generateOrderNumberFromUUID,
} from '../../../shared/common';
import {
  changeProductQuantity,
  removeProductFromCart,
} from '../../../shared/reducers/shopping-cart/shopping-cart.actions';
import { OrdersService } from '../../../shared/services/orders/orders.service';
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
export class CheckoutComponent implements OnDestroy {
  shoppingCart$: Observable<CartProduct[]>;
  checkoutForm: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required),
    paymentMethod: new FormControl('', Validators.required),
    notes: new FormControl(''),
  });
  cartPriceTotal = 0;
  isSubmitting = false;
  private cartSubscription: Subscription;

  stripe = injectStripe(environment.stripe.publishable_key);

  paymentOptions = [
    { label: 'Χρεωστική/Πιστωτική καρτα *', value: 'card' },
    { label: 'IRIS Payment', value: 'iris' },
    { label: 'Κατάθεση σε τραπεζικό λογαριασμό', value: 'bank_transaction' },
  ];

  constructor(
    private store: Store<StoreType>,
    private router: Router,
    private stripePaymentsService: StripePaymentsService,
    private stripeService: StripeService,
    private ordersService: OrdersService,
  ) {
    this.shoppingCart$ = this.store.select('shoppingCart');

    this.cartSubscription = this.shoppingCart$.subscribe((cart) => {
      this.cartPriceTotal = cart.reduce(
        (acc, curr) => acc + curr.price * curr.quantity,
        0,
      );

      // If cart is empty, redirect to home
      // Only redirect if not currently submitting (prevents race condition with order-placed clearing cart)
      if (cart.length === 0 && !this.isSubmitting) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe to prevent redirect when cart is cleared on order-placed page
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
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
    if (this.checkoutForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      // Get cart products from observable
      this.shoppingCart$.pipe(take(1)).subscribe(async (cartProducts) => {
        try {
          const orderId = uuidv4();
          const order_number = generateOrderNumberFromUUID(orderId);
          const paymentMethod =
            this.checkoutForm.controls['paymentMethod'].value;
          const productIds = cartProducts.map((product) => product.id);

          // Extract selected colours from cart products
          const selectedColours = cartProducts
            .filter((product) => product.selectedColour)
            .map((product) => ({
              productId: product.id,
              colour: product.selectedColour!,
            }));

          // Handle different payment methods
          if (paymentMethod === 'card') {
            // Card payment: Create Stripe checkout session
            const session = await firstValueFrom(
              this.stripePaymentsService.createCheckoutSession(
                order_number,
                this.cartPriceTotal * 100,
                this.checkoutForm.controls['email'].value,
              ),
            );

            if (!session) {
              throw new Error('Failed to create checkout session');
            }

            // Store the order in Firestore
            await this.ordersService.storeOrder(
              orderId,
              order_number,
              session.sessionId,
              'pending',
              productIds,
              paymentMethod,
              this.cartPriceTotal,
              this.checkoutForm.controls['email'].value,
              selectedColours,
            );

            // Redirect to Stripe checkout
            this.stripeService
              .redirectToCheckout({
                sessionId: session.sessionId,
              })
              .subscribe((result) => {
                // If `redirectToCheckout` fails due to a browser or network
                // error, you should display the localized error message to your
                // customer using `error.message`.
                if (result.error) {
                  alert(result.error.message);
                  this.isSubmitting = false;
                }
              });
          } else if (
            paymentMethod === 'iris' ||
            paymentMethod === 'bank_transaction'
          ) {
            console.log('Processing non-card payment method');
            // IRIS or Bank Transaction: Store order and send payment instructions email
            // Ensure order is stored before navigation
            try {
              await this.ordersService.storeOrder(
                orderId,
                order_number,
                '', // No session ID for non-Stripe payments
                'pending',
                productIds,
                paymentMethod,
                this.cartPriceTotal,
                this.checkoutForm.controls['email'].value,
                selectedColours,
              );

              console.log(
                'Order stored successfully, sending payment instructions',
              );

              // Send payment instructions email
              const emailResult =
                await this.ordersService.sendPaymentInstructions(order_number);

              if (emailResult.error) {
                alert(emailResult.error);
                // Still proceed even if email fails
              }
              // Redirect to order-placed page with query parameters
              // Using await router.navigate to ensure navigation completes
              this.router.navigate(['order-placed'], {
                queryParams: {
                  paymentMethod: paymentMethod,
                  orderNumber: order_number,
                },
              });
            } catch (error) {
              console.error('Error storing order or sending email:', error);
              throw error; // Re-throw to be caught by outer catch block
            }
          } else {
            throw new Error('Invalid payment method selected');
          }
        } catch (error) {
          console.error('Error during checkout:', error);
          alert('An error occurred during checkout. Please try again.');
          this.isSubmitting = false;
        }
      });
    }
  }

  protected readonly convertPriceToFloat = convertPriceToFloat;
}
