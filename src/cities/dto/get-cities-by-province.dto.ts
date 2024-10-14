import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

import { Province } from 'src/orders/entities/order.entity';

export class GetCitiesByProvinceDto {
  @IsNotEmpty()
  @IsEnum(Province)
  province: Province;

  @IsNotEmpty()
  @IsNumber()
  page: number;

  @IsNotEmpty()
  @IsNumber()
  limit: number;
}
