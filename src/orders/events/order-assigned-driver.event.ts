import { Order } from '../entities/order.entity';

export class OrderAssignedDriverEvent {
  order: Order;
  email: string;
}
