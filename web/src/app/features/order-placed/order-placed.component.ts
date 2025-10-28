import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { OrdersService } from '../../shared/services/orders/orders.service';

type PaymentMethod = 'card' | 'iris' | 'bank_transaction';

@Component({
  selector: 'app-order-placed',
  imports: [ButtonModule, LoadingSpinnerComponent, CommonModule],
  templateUrl: './order-placed.component.html',
  styleUrl: './order-placed.component.scss',
  standalone: true,
})
export class OrderPlacedComponent implements OnInit {
  paymentMethod: PaymentMethod = 'card';
  orderNumber = '';
  totalAmount = 0;
  isLoading = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ordersService: OrdersService,
  ) {}

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async (params) => {
      const orderNumber = params['orderNumber'];

      // If no order number in URL, redirect to home
      if (!orderNumber) {
        this.router.navigate(['/']);
        return;
      }

      // Fetch order from database
      const order = await this.ordersService.getOrderByOrderNumber(orderNumber);

      // If order not found, redirect to home
      if (!order) {
        this.router.navigate(['/']);
        return;
      }

      // Set order data
      this.orderNumber = order.order_number;
      this.paymentMethod = order.payment_method as PaymentMethod;
      this.totalAmount = order.amount;
      setTimeout(() => (this.isLoading = false), 2000);
    });
  }

  getPaymentMessage(): string {
    switch (this.paymentMethod) {
      case 'card':
        return `Η πληρωμή σας έχει ολοκληρωθεί επιτυχώς και η παραγγελία σας με αριθμό <b>${this.orderNumber}</b> θα αποσταλεί το συντομότερο δυνατό στο Box Now locker που επιλέξατε. Θα λάβετε ενημέρωση μέσω email για την αποστολή της παραγγελίας σας.`;
      case 'iris':
        return `Η παραγγελία σας έχει καταχωρηθεί επιτυχώς στο σύστημά μας με αριθμό <b>${this.orderNumber}</b> και θα αποσταλεί στο Box Now locker που επιλέξατε αμέσως μετά την επιβεβαίωση της πληρωμής. Παρακαλούμε προχωρήστε σε πληρωμή του ποσού <b>${this.totalAmount.toFixed(2)} €</b> στον αριθμό <b>6948484848</b> και συμπεριλάβετε υποχρεωτικά στο σχόλιο τον αριθμό παραγγελίας σας.`;
      case 'bank_transaction':
        return `Η παραγγελία σας έχει καταχωρηθεί επιτυχώς στο σύστημά μας με αριθμό <b>${this.orderNumber}</b> και θα αποσταλεί στο Box Now locker που επιλέξατε αμέσως μετά την επιβεβαίωση της πληρωμής. Παρακαλούμε προχωρήστε σε κατάθεση του ποσού <b>${this.totalAmount.toFixed(2)} €</b> στον τραπεζικό λογαριασμό <b>GR1601101230000012345678900</b> και συμπεριλάβετε υποχρεωτικά στην αιτιολογία τον αριθμό παραγγελίας σας.`;
      default:
        return '';
    }
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
