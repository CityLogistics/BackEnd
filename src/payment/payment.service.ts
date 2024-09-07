import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderStatus } from 'src/orders/entities/order.entity';
import Stripe from 'stripe';

@Injectable()
export class PaymentService extends Stripe {
  constructor(
    private config: ConfigService,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {
    super(config.get('STRIPE_SECRETE_KEY'));
  }

  async getProducts(): Promise<Stripe.Product[]> {
    const products = await this.products.list();
    return products.data;
  }

  async getCustomers() {
    const customers = await this.customers.list({});
    return customers.data;
  }
  async createCheckout(amount: number, orderId: string) {
    const product = this.config.get<string>('PRODUCT_ID');

    const session = await this.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            unit_amount: amount,
            currency: 'CAD',
            product,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://mycitylogistics.ca/payment-success`,
      cancel_url: `https://mycitylogistics.ca/payment-failed`,
      metadata: {
        orderId,
      },
    });

    return session.url;
  }

  async updatePaymentStatus(orderId: string, price: number) {
    const order = await this.orderModel.findById(orderId);
    if (order.totalPrice == price) {
      order.status = OrderStatus.PENDING_ASSIGNMENT;
      await order.save();
    }
  }
}
