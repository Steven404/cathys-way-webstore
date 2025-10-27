import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

type PaymentMethod = 'card' | 'iris' | 'bank_transaction';

@Component({
  selector: 'app-order-placed',
  imports: [ButtonModule],
  templateUrl: './order-placed.component.html',
  styleUrl: './order-placed.component.scss',
  standalone: true,
})
export class OrderPlacedComponent implements OnInit {
  paymentMethod: PaymentMethod = 'card';
  orderNumber = '';
  totalAmount = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.paymentMethod = params['method'] || 'card';
      this.orderNumber = params['orderNumber'] || this.generateOrderNumber();
      this.totalAmount = parseFloat(params['amount']) || 0;
    });
  }

  generateOrderNumber(): string {
    return 'ORD' + Date.now().toString().slice(-8);
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
