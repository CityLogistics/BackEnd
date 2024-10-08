import { IsEnum, IsNotEmpty } from 'class-validator';
import { Province } from 'src/orders/entities/order.entity';

export class CreateCityDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(Province)
  province: Province;
}
