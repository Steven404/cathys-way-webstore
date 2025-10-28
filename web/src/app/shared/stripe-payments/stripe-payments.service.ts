import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

@Injectable({ providedIn: 'root' })
export class StripePaymentsService {
  constructor(private fns: AngularFireFunctions) {}

  createPaymentIntent(amount: number) {
    const callable = this.fns.httpsCallable('createPaymentIntent');
    return callable({ amount });
  }

  createCheckoutSession(order_number: string, amount: number, email: string) {
    const callable = this.fns.httpsCallable('createCheckoutSession');
    return callable({ amount, email, order_number });
  }
}
