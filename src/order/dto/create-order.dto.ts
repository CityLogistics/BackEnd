import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  id: number;
  @ApiProperty()
  user: string;
}
