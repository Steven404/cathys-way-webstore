import { FieldValue, Timestamp } from '@angular/fire/firestore';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onCall, onRequest } from 'firebase-functions/v2/https';
import * as nodemailer from 'nodemailer';
import Stripe from 'stripe';

type OrderStatus = 'pending' | 'paid';
type PaymentMethod = 'card' | 'iris' | 'bank_transaction';

export interface Order {
  id: string;
  stripe_session_id: string;
  status: OrderStatus;
  products: string[];
  payment_method: PaymentMethod;
  order_number: string;
  amount: number;
  hasSendEmail: boolean;
  email: string;
  selectedColours: { productId: string; colour: string }[];
  createdAt: Timestamp | FieldValue;
}

initializeApp();
const db = getFirestore();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_APP_PASSWORD,
  },
});

interface CreateCheckoutSessionRequest {
  data: {
    order_number: string;
    amount: number;
    email: string;
    base_url?: string;
  };
}

interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  mainImageUrl?: string;
}

// Helper function to fetch order by order number
async function fetchOrderByOrderNumber(orderNumber: string) {
  const ordersCollection = db.collection('orders');
  const orderQuery = await ordersCollection
    .where('order_number', '==', orderNumber)
    .get();

  if (orderQuery.empty) {
    return null;
  }

  const orderDoc = orderQuery.docs[0];
  const order = orderDoc.data() as Order;

  return { orderDoc, order };
}

// Helper function to fetch product details from order
async function fetchProductsFromOrder(order: Order): Promise<Product[]> {
  const products: Product[] = [];

  for (const productId of order.products) {
    const productDoc = await db.collection('products').doc(productId).get();
    if (productDoc.exists) {
      const productData = productDoc.data();
      products.push({
        id: productDoc.id,
        code: productData?.code || '',
        name: productData?.name || '',
        price: productData?.price || 0,
        mainImageUrl: productData?.mainImageUrl || '',
      });
    }
  }

  return products;
}

// Helper function to create selected colours map
function createSelectedColoursMap(
  selectedColours?: { productId: string; colour: string }[],
): Map<string, string> {
  const selectedColoursMap = new Map<string, string>();
  if (selectedColours && selectedColours.length > 0) {
    selectedColours.forEach((item) => {
      selectedColoursMap.set(item.productId, item.colour);
    });
  }
  return selectedColoursMap;
}

// Helper function to build product list HTML
function buildProductListHtml(
  products: Product[],
  selectedColoursMap: Map<string, string>,
): string {
  return products
    .map((product) => {
      const selectedColour = selectedColoursMap.get(product.id);
      const colourInfo = selectedColour
        ? `<br/><span style="font-size: 0.9em; color: #666;">Χρώμα: ${selectedColour}</span>`
        : '';

      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">
            ${product.name} (${product.code})${colourInfo}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">
            €${product.price.toFixed(2)}
          </td>
        </tr>
      `;
    })
    .join('');
}

exports.createCheckoutSession = onCall(
  async (request: CreateCheckoutSessionRequest) => {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET || '', {
        apiVersion: '2025-09-30.clover',
      });
      const { amount, email, order_number } = request.data;

      const baseUrl =
        process.env.FRONTEND_URL ||
        request.data.base_url ||
        'http://localhost:4200';

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: email,
        metadata: {
          order_number,
        },
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
        success_url: `${baseUrl}/order-placed?orderNumber=${order_number}`, // TODO: replace url with process.env.FRONTEND_URL
        cancel_url: `${baseUrl}/checkout`,
      });

      return { sessionId: session.id };
    } catch (error: unknown) {
      return { error: (error as Error).message };
    }
  },
);

exports.stripeSessionCompleteWebhook = onRequest(async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET || '', {
      apiVersion: '2025-09-30.clover',
    });

    // Verify webhook signature
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig as string,
        webhookSecret,
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      res.status(400).send(`Webhook Error: ${(err as Error).message}`);
      return;
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderNumber = session.metadata?.order_number;

      if (!orderNumber) {
        console.error('No order_number in session metadata');
        res.status(400).send('No order_number in session metadata');
        return;
      }

      // 1) Fetch the order doc from Firestore
      const orderResult = await fetchOrderByOrderNumber(orderNumber);

      if (!orderResult) {
        console.error(`Order not found: ${orderNumber}`);
        res.status(404).send('Order not found');
        return;
      }

      const { orderDoc, order } = orderResult;
      const customerEmail = session.customer_email;

      if (!customerEmail) {
        console.error('No customer email in session');
        res.status(400).send('No customer email in session');
        return;
      }

      // 2) Change the order status to "paid"
      await orderDoc.ref.update({
        status: 'paid',
        hasSendEmail: true,
      });

      // Fetch product details
      const products = await fetchProductsFromOrder(order);

      // Create a map of product IDs to selected colors
      const selectedColoursMap = createSelectedColoursMap(
        order.selectedColours,
      );

      // Build email HTML with order details
      const productListHtml = buildProductListHtml(
        products,
        selectedColoursMap,
      );

      const emailHtml = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>Επιβεβαίωση Παραγγελίας</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #9333ea;">Επιβεβαίωση Παραγγελίας</h1>
              <p>Σας ευχαριστούμε για την αγορά!</p>

              <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p><strong>Αριθμός Παραγγελίας:</strong> ${orderNumber}</p>
                <p><strong>Συνολικό Ποσό:</strong> €${order.amount.toFixed(2)}</p>
              </div>

              <h2 style="color: #333; margin-top: 30px;">Λεπτομέρειες</h2>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <thead>
                  <tr style="background-color: #f2f2f2;">
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Προϊόν</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Τιμή</th>
                  </tr>
                </thead>
                <tbody>
                  ${productListHtml}
                </tbody>
              </table>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p>Σας αποσταλθεί εντώς των επόμενων 2 εργάσημων ημερών email με τον αριθμό παρακολούθησης της box now.</p>
                <p>Aν έχετε απορίες σχετικά με την παραγγελία σας παρακαλώ απευθυνθείτε στο <a href="help@cathysway.com">help@cathysway.com</a></p>
                <p>Thank you for shopping with us!</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: customerEmail,
        subject: `Επιβεβαίωση παραγγελίας - ${orderNumber}`,
        html: emailHtml,
      };

      await transporter.sendMail(mailOptions);

      console.log(
        `Order ${orderNumber} updated to paid and confirmation email sent to ${customerEmail}`,
      );
      res.status(200).json({ received: true });
    } else {
      res.status(200).json({ received: true });
    }
  } catch (error: unknown) {
    console.error('Error processing webhook:', error);
    res.status(500).send(`Webhook Error: ${(error as Error).message}`);
  }
});

interface SendPaymentInstructionsRequest {
  data: {
    order_number: string;
  };
}

exports.sendPaymentInstructions = onCall(
  async (request: SendPaymentInstructionsRequest) => {
    try {
      const { order_number } = request.data;

      // Fetch the order from Firestore
      const orderResult = await fetchOrderByOrderNumber(order_number);

      if (!orderResult) {
        console.error(`Order not found: ${order_number}`);
        return { error: 'Order not found' };
      }

      const { orderDoc, order } = orderResult;

      console.log('order: ', order);

      // Only send instructions for IRIS or bank_transaction payments
      if (
        order.payment_method !== 'iris' &&
        order.payment_method !== 'bank_transaction'
      ) {
        return {
          error: 'This function is only for IRIS or bank transfer payments',
        };
      }

      // Check if email was already sent
      if (order.hasSendEmail) {
        return { error: 'Payment instructions already sent for this order' };
      }

      // Fetch product details
      const products = await fetchProductsFromOrder(order);

      // Create a map of product IDs to selected colors
      const selectedColoursMap = createSelectedColoursMap(
        order.selectedColours,
      );

      // Build email HTML with order details
      const productListHtml = buildProductListHtml(
        products,
        selectedColoursMap,
      );

      // Payment instructions based on method
      let paymentInstructions = '';
      let paymentMethodTitle = '';

      if (order.payment_method === 'iris') {
        paymentMethodTitle = 'IRIS';
        paymentInstructions = `
          <div style="background-color: #fef3c7; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #f59e0b;">
            <h3 style="margin-top: 0; color: #92400e;">Οδηγίες Πληρωμής IRIS</h3>
            <p><strong>Αριθμός τηλεφώνου για πληρωμή IRIS:</strong></p>
            <p style="font-size: 1.2em; font-weight: bold; color: #92400e;">6948484848</p>
            <p style="margin-top: 15px;"><strong>Σημαντικό:</strong></p>
            <ul style="margin-top: 10px;">
              <li>Παρακαλώ προσθέστε τον <strong>αριθμό παραγγελίας ${order_number}</strong> στα σχόλια της συναλλαγής</li>
              <li>Η παραγγελία σας θα διαγραφεί αυτόματα σε <strong>48 ώρες</strong> εάν δεν ολοκληρωθεί η πληρωμή</li>
            </ul>
          </div>
        `;
      } else if (order.payment_method === 'bank_transaction') {
        paymentMethodTitle = 'Τραπεζική Κατάθεση';
        paymentInstructions = `
          <div style="background-color: #fef3c7; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #f59e0b;">
            <h3 style="margin-top: 0; color: #92400e;">Οδηγίες Τραπεζικής Κατάθεσης</h3>
            <p><strong>IBAN:</strong></p>
            <p style="font-size: 1.2em; font-weight: bold; color: #92400e;">GR1601101230000012345678900</p>
            <p style="margin-top: 15px;"><strong>Σημαντικό:</strong></p>
            <ul style="margin-top: 10px;">
              <li>Παρακαλώ προσθέστε τον <strong>αριθμό παραγγελίας ${order_number}</strong> στα σχόλια/πληροφορίες δικαιούχου</li>
              <li>Η παραγγελία σας θα διαγραφεί αυτόματα σε <strong>48 ώρες</strong> εάν δεν ολοκληρωθεί η πληρωμή</li>
            </ul>
          </div>
        `;
      }

      const emailHtml = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>Οδηγίες Πληρωμής</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #9333ea;">Οδηγίες Πληρωμής - ${paymentMethodTitle}</h1>
              <p>Σας ευχαριστούμε για την παραγγελία σας!</p>

              <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p><strong>Αριθμός Παραγγελίας:</strong> ${order_number}</p>
                <p><strong>Συνολικό Ποσό:</strong> €${order.amount.toFixed(2)}</p>
                <p><strong>Μέθοδος Πληρωμής:</strong> ${paymentMethodTitle}</p>
              </div>

              ${paymentInstructions}

              <h2 style="color: #333; margin-top: 30px;">Λεπτομέρειες Παραγγελίας</h2>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <thead>
                  <tr style="background-color: #f2f2f2;">
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Προϊόν</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Τιμή</th>
                  </tr>
                </thead>
                <tbody>
                  ${productListHtml}
                </tbody>
              </table>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p>Μετά την επιβεβαίωση της πληρωμής, θα σας αποσταλεί email επιβεβαίωσης.</p>
                <p>Στη συνέχεια, θα λάβετε εντώς των επόμενων 2 εργάσημων ημερών email με τον αριθμό παρακολούθησης της box now.</p>
                <p>Aν έχετε απορίες σχετικά με την παραγγελία σας παρακαλώ απευθυνθείτε στο <a href="mailto:help@cathysway.com">help@cathysway.com</a></p>
                <p>Thank you for shopping with us!</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: order.email,
        subject: `Οδηγίες Πληρωμής - ${order_number}`,
        html: emailHtml,
      };

      await transporter.sendMail(mailOptions);

      // Update the order to mark email as sent
      await orderDoc.ref.update({
        hasSendEmail: true,
      });

      console.log(
        `Payment instructions sent for order ${order_number} to ${order.email}`,
      );

      return { success: true, message: 'Payment instructions sent' };
    } catch (error: unknown) {
      console.error('Error sending payment instructions:', error);
      return { error: (error as Error).message };
    }
  },
);
