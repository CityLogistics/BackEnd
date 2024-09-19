import { Order } from '../entities/order.entity';

export class OrderRejectedAdminEvent {
  order: Order;
}
