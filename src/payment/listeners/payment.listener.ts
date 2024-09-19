import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { OrderCreatedEvent } from 'src/orders/events/order-created.event';
import { ORDER_PAYMENT_COMPLETED } from 'src/common/jobs';

@Injectable()
export class PaymentListener {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  @OnEvent('order.created')
  async handleOrderCreatedEvent(event: OrderCreatedEvent) {
    // handle and process "OrderCreatedEvent" event

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const job = await this.emailQueue.add(ORDER_PAYMENT_COMPLETED, {
      email: event.order.email,
      order: event.order,
      paymentUrl: event.paymentUrl,
    });
  }
}
