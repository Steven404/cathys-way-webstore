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
      timeCreated: Timestamp.now(),
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
}
