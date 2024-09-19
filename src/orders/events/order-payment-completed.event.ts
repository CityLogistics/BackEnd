import { Order } from '../entities/order.entity';

export class OrderPaymentCompletedEvent {
  order: Order;
}
