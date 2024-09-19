import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { OrderCreatedEvent } from '../events/order-created.event';
import {
  ORDER_ACCEPTED_DRIVER,
  ORDER_ASSIGNED_DRIVER,
  ORDER_COMPLETED,
  ORDER_CREATED,
  ORDER_DELIVERED,
  ORDER_PAYMENT_COMPLETED,
  ORDER_REJECTED_ADMIN,
  ORDER_REJECTED_DRIVER,
} from 'src/common/jobs';
import { OrderPaymentCompletedEvent } from '../events/order-payment-completed.event';
import { OrderAssignedDriverEvent } from '../events/order-assigned-driver.event';
import { OrderRejectedAdminEvent } from '../events/order-rejected-admin.event';
import { OrderAcceptedDriverEvent } from '../events/order-accepted-driver.event';
import { OrderRejectedDriverEvent } from '../events/order-rejected-driver.event';
import { OrderDeliveredEvent } from '../events/order-delivered';
import { OrderCompletedEvent } from '../events/order-completed';

@Injectable()
export class OrderListener {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  @OnEvent(ORDER_CREATED)
  async handleOrderCreatedEvent(event: OrderCreatedEvent) {
    // handle and process "OrderCreatedEvent" event
    await this.emailQueue.add(ORDER_CREATED, {
      email: event.order.email,
      order: event.order,
      paymentUrl: event.paymentUrl,
    });
  }

  @OnEvent(ORDER_PAYMENT_COMPLETED)
  async handleOrderPaymentCompletedEvent(event: OrderPaymentCompletedEvent) {
    // handle and process "OrderCreatedEvent" event

    await this.emailQueue.add(ORDER_PAYMENT_COMPLETED, {
      order: event.order,
    });
  }

  @OnEvent(ORDER_REJECTED_ADMIN)
  async handleRejectedAdminCompletedEvent(event: OrderRejectedAdminEvent) {
    // handle and process "OrderCreatedEvent" event

    await this.emailQueue.add(ORDER_REJECTED_ADMIN, {
      order: event.order,
    });
  }

  @OnEvent(ORDER_ASSIGNED_DRIVER)
  async handleOrderAssignedDriverCompletedEvent(
    event: OrderAssignedDriverEvent,
  ) {
    // handle and process "OrderCreatedEvent" event

    await this.emailQueue.add(ORDER_ASSIGNED_DRIVER, {
      order: event.order,
      email: event.email,
    });
  }

  @OnEvent(ORDER_ACCEPTED_DRIVER)
  async handleOrderAcceptedDriverCompletedEvent(
    event: OrderAcceptedDriverEvent,
  ) {
    // handle and process "OrderCreatedEvent" event

    await this.emailQueue.add(ORDER_ACCEPTED_DRIVER, {
      order: event.order,
      driverName: event.driverName,
    });
  }

  @OnEvent(ORDER_REJECTED_DRIVER)
  async handleOrderRejectedDriverCompletedEvent(
    event: OrderRejectedDriverEvent,
  ) {
    // handle and process "OrderCreatedEvent" event

    await this.emailQueue.add(ORDER_REJECTED_DRIVER, {
      order: event.order,
      driverName: event.driverName,
    });
  }

  @OnEvent(ORDER_DELIVERED)
  async handleOrderDeliveredEvent(event: OrderDeliveredEvent) {
    // handle and process "OrderCreatedEvent" event

    await this.emailQueue.add(ORDER_DELIVERED, {
      order: event.order,
      driverName: event.driverName,
    });
  }

  @OnEvent(ORDER_COMPLETED)
  async handleOrderCompletedEvent(event: OrderCompletedEvent) {
    // handle and process "OrderCreatedEvent" event

    await this.emailQueue.add(ORDER_COMPLETED, {
      order: event.order,
    });
  }
}
