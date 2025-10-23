import { initializeApp } from 'firebase-admin/app';
import { onCall } from 'firebase-functions/v2/https';
import Stripe from 'stripe';

initializeApp();

interface CreatePaymentIntentRequest {
  data: {
    amount: number;
  };
}

exports.createPaymentIntent = onCall(
  async (request: CreatePaymentIntentRequest) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET || '', {
      apiVersion: '2025-09-30.clover',
    });
    const { amount } = request.data;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
    });

    console.log('secret: ', paymentIntent.client_secret);
    return { clientSecret: paymentIntent.client_secret };
  },
);
