import { initializeApp } from 'firebase-admin/app';
import { onCall } from 'firebase-functions/v2/https';
import Stripe from 'stripe';

initializeApp();

interface CreatePaymentIntentRequest {
  data: {
    amount: number;
  };
}

interface CreateCheckoutSessionRequest {
  data: {
    order_number: string;
    amount: number;
    email: string;
  };
}

exports.createPaymentIntent = onCall(
  async (request: CreatePaymentIntentRequest) => {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET || '', {
        apiVersion: '2025-09-30.clover',
      });
      const { amount } = request.data;
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'eur',
        automatic_payment_methods: { enabled: true },
      });

      return { clientSecret: paymentIntent.client_secret };
    } catch (error: unknown) {
      return { error: (error as Error).message };
    }
  },
);

exports.createCheckoutSession = onCall(
  async (request: CreateCheckoutSessionRequest) => {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET || '', {
        apiVersion: '2025-09-30.clover',
      });
      const { amount, email, order_number } = request.data;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Order',
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:4200'}/order-placed?method=card&orderNumber=${order_number}&amount=${amount}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:4200'}/`,
      });

      return { sessionId: session.id };
    } catch (error: unknown) {
      return { error: (error as Error).message };
    }
  },
);
