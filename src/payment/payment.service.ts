import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderStatus } from 'src/orders/entities/order.entity';
import {
  TransactionStatus,
  TransactionType,
} from 'src/transactions/entities/transaction.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentService extends Stripe {
  constructor(
    private config: ConfigService,
    private transactionService: TransactionsService,
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

  async updatePaymentCompleted(
    orderId: string,
    price: number,
    refrence: string,
    paymentIntent: string,
  ) {
    try {
      const order = await this.orderModel.findById(orderId);
      if (order.totalPrice == price) {
        this.transactionService.create({
          amount: order.totalPrice,
          orderId: order.id,
          refrence,
          status: TransactionStatus.SUCCESSFULL,
          paymentIntent,
          transactionType: TransactionType.ORDER,
        });
        order.status = OrderStatus.PENDING_ASSIGNMENT;
        order.tranasctionReference = refrence;

        await order.save();
      } else {
        this.transactionService.create({
          amount: price,
          orderId: order.id,
          refrence,
          status: TransactionStatus.FAILED,
          misc: 'Paid amount does not match order amount',
          paymentIntent,
          transactionType: TransactionType.ORDER,
        });
        order.status = OrderStatus.PAYMENT_FAILED;
        order.tranasctionReference = refrence;
        await order.save();
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async updatePaymentFailed(orderId: string, price: number, refrence: string) {
    try {
      const order = await this.orderModel.findById(orderId);
      if (order.totalPrice == price) {
        order.status = OrderStatus.PAYMENT_FAILED;

        await order.save();
        this.transactionService.create({
          amount: order.totalPrice,
          orderId: order.id,
          refrence,
          status: TransactionStatus.SUCCESSFULL,
          transactionType: TransactionType.ORDER,
        });
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async issueRefund(paymentIntent: string) {
    const refund = await this.refunds.create({
      payment_intent: paymentIntent,
    });

    if (refund.status == 'pending' || refund.status == 'succeeded') {
      await this.transactionService.create({
        amount: refund.amount,
        orderId: '',
        refrence: refund.id,
        status:
          refund.status == 'pending'
            ? TransactionStatus.PENDING
            : TransactionStatus.SUCCESSFULL,
        transactionType: TransactionType.REFUND,
      });
    }
    return refund.status;
  }
}
