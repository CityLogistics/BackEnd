import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  status?: OrderStatus;
}
