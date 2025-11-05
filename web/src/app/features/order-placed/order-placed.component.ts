import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { Observable } from 'rxjs';

import { CartProduct, StoreType } from '../../core/types';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { clearCart } from '../../shared/reducers/shopping-cart/shopping-cart.actions';
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
  shoppingCart$: Observable<CartProduct[]>;
  paymentMethod: PaymentMethod = 'card';
  orderNumber = '';
  totalAmount = 0;
  isLoading = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ordersService: OrdersService,
    private store: Store<StoreType>,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.shoppingCart$ = this.store.select('shoppingCart');
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async (params) => {
      const orderNumber = params['orderNumber'];
      const paymentMethod = params['paymentMethod'];

      if (paymentMethod) {
        this.paymentMethod = paymentMethod;
      }

      if (!orderNumber) {
        this.router.navigate(['/']);
        if (isPlatformBrowser(this.platformId)) {
          alert('Order not found. Please contact help@cathysway.com.');
        }
        return;
      }

      const order = await this.ordersService.getOrderByOrderNumber(orderNumber);

      if (!order) {
        this.router.navigate(['/']);
        if (isPlatformBrowser(this.platformId)) {
          alert('Order not found. Please contact help@cathysway.com.');
        }
        return;
      }

      this.store.dispatch(() => clearCart());

      // Set order data
      this.orderNumber = order.order_number;
      this.paymentMethod = order.payment_method as PaymentMethod;
      this.totalAmount = order.amount;
      this.isLoading = false;
    });
  }

  getPaymentMessage(): string {
    switch (this.paymentMethod) {
      case 'card':
        return `Η πληρωμή σας έχει ολοκληρωθεί επιτυχώς και η παραγγελία σας με αριθμό <b>${this.orderNumber}</b> θα αποσταλεί το συντομότερο δυνατό στο Box Now locker που επιλέξατε. Θα λάβετε ενημέρωση μέσω email για την αποστολή της παραγγελίας σας.`;
      case 'iris':
        return `Η παραγγελία σας έχει καταχωρηθεί επιτυχώς στο σύστημά μας με αριθμό <b>${this.orderNumber}</b> και θα αποσταλεί στο Box Now locker που επιλέξατε αμέσως μετά την επιβεβαίωση της πληρωμής. Παρακαλούμε προχωρήστε σε πληρωμή του ποσού <b>${this.totalAmount.toFixed(2)} €</b> στον αριθμό <b>6948484848</b> και συμπεριλάβετε υποχρεωτικά στο σχόλιο τον αριθμό παραγγελίας σας. <br/><br/><b>Σημείωση:</b> Αν η πληρωμή δεν ολοκληρωθεί εντός 48 ωρών, η παραγγελία σας θα ακυρωθεί αυτόματα.`;
      case 'bank_transaction':
        return `Η παραγγελία σας έχει καταχωρηθεί επιτυχώς στο σύστημά μας με αριθμό <b>${this.orderNumber}</b> και θα αποσταλεί στο Box Now locker που επιλέξατε αμέσως μετά την επιβεβαίωση της πληρωμής. Παρακαλούμε προχωρήστε σε κατάθεση του ποσού <b>${this.totalAmount.toFixed(2)} €</b> στον τραπεζικό λογαριασμό <b>GR1601101230000012345678900</b> και συμπεριλάβετε υποχρεωτικά στην αιτιολογία τον αριθμό παραγγελίας σας. <br/><br/><b>Σημείωση:</b> Αν η πληρωμή δεν ολοκληρωθεί εντός 48 ωρών, η παραγγελία σας θα ακυρωθεί αυτόματα.`;
      default:
        return '';
    }
  }

  goToHome() {
    console.log('Navigating to home');
    this.router.navigate(['/']);
  }
}
