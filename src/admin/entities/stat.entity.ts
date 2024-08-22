import { ApiProperty } from '@nestjs/swagger';

export class Stat {
  @ApiProperty()
  totalOrders: number;

  @ApiProperty()
  totalDrivers: number;

  @ApiProperty()
  totalOrdersInTransit: number;

  @ApiProperty()
  pendingOrders: number;
}
