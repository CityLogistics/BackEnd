import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Province } from 'src/orders/entities/order.entity';

export class GetAllCitiesDto {
  @IsOptional()
  @IsArray({})
  @IsEnum(Province, {
    each: true,
  })
  provinces?: Province[];

  @IsNotEmpty()
  @IsNumber()
  page: number;

  @IsNotEmpty()
  @IsNumber()
  limit: number;
}
