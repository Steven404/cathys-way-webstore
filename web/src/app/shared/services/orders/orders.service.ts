import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';

import {
  Order,
  OrderStatus,
  PaymentMethod,
} from '../../../../../../commonTypes';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private firestore = inject(Firestore);
  private functions = inject(Functions);

  async storeOrder(
    id: string,
    order_number: string,
    stripe_session_id: string,
    status: OrderStatus,
    products: string[],
    payment_method: PaymentMethod,
    amount: number,
    email: string,
    selectedColours: { productId: string; colour: string }[],
  ): Promise<void> {
    // TODO: Store phone number and shipping address (box now) when needed
    const order: Order = {
      id,
      stripe_session_id,
      status,
      products,
      payment_method,
      order_number,
      amount,
      hasSendEmail: false,
      email,
      createdAt: Timestamp.now(),
      selectedColours,
    };

    const orderDocRef = doc(this.firestore, 'orders', id);
    await setDoc(orderDocRef, order);
  }

  async updateOrderPaymentStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<void> {
    const orderDocRef = doc(this.firestore, 'orders', orderId);
    await updateDoc(orderDocRef, { status });
  }

  async updateOrderEmailStatus(orderId: string): Promise<void> {
    const orderDocRef = doc(this.firestore, 'orders', orderId);
    await updateDoc(orderDocRef, { hasSendEmail: true });
  }

  async getOrderByOrderNumber(order_number: string): Promise<Order | null> {
    const ordersCollection = collection(this.firestore, 'orders');
    const q = query(
      ordersCollection,
      where('order_number', '==', order_number),
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const orderDoc = querySnapshot.docs[0];
    return orderDoc.data() as Order;
  }

  async sendPaymentInstructions(
    order_number: string,
  ): Promise<{ success?: boolean; error?: string }> {
    const sendPaymentInstructionsCallable = httpsCallable<
      { order_number: string },
      { success?: boolean; message?: string; error?: string }
    >(this.functions, 'sendPaymentInstructions');

    try {
      const result = await sendPaymentInstructionsCallable({ order_number });
      return result.data;
    } catch (error) {
      console.error('Error calling sendPaymentInstructions function:', error);
      return { error: (error as Error).message };
    }
  }
}
