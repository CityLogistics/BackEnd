import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { OrderCreatedEvent } from '../events/order-created.event';

@Injectable()
export class OrderListener {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  @OnEvent('order.created')
  async handleOrderCreatedEvent(event: OrderCreatedEvent) {
    // handle and process "OrderCreatedEvent" event

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const job = await this.emailQueue.add('order.created', {
      email: event.order.email,
      order: event.order,
      paymentUrl: event.paymentUrl,
    });
  }
}
