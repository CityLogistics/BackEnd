import { Order } from '../entities/order.entity';

export class OrderRejectedDriverEvent {
  order: Order;
  driverName: string;
}
