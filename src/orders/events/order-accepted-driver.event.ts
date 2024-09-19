import { Order } from '../entities/order.entity';

export class OrderAcceptedDriverEvent {
  order: Order;
  driverName: string;
}
