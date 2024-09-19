import { Order } from '../entities/order.entity';

export class OrderCreatedEvent {
  order: Order;
  paymentUrl: string;
}
