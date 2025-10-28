import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';

type OrderStatus = 'pending' | 'paid';
type PaymentMethod = 'card' | 'iris' | 'bank_transfer';

interface Order {
  id: string;
  stripe_session_id: string;
  status: OrderStatus;
  products: string[];
  payment_method: PaymentMethod;
  order_number: string;
  amount: number;
  hasSendEmail: boolean;
}

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
