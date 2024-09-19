import { Order } from '../entities/order.entity';

export class OrderCompletedEvent {
  order: Order;
}
