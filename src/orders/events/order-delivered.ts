import { Order } from '../entities/order.entity';

export class OrderDeliveredEvent {
  order: Order;
  driverName: string;
}
