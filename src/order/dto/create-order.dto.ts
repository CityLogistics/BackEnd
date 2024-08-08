import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  name: string;

  age: number;

  @ApiProperty()
  breed: string;
}
