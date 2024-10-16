import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import {
  AvailabiltyDay,
  AvailabiltyTime,
  DriverStatus,
  VehicleType,
} from '../entities/driver.entity';

export class GetDriverDto {
  @IsOptional()
  @IsArray({})
  @IsEnum(AvailabiltyDay, {
    each: true,
  })
  days?: AvailabiltyDay[];

  @IsOptional()
  @IsArray({})
  @IsEnum(VehicleType, {
    each: true,
  })
  carTypes?: VehicleType[];

  @IsOptional()
  @IsArray({})
  @IsEnum(AvailabiltyTime, {
    each: true,
  })
  availabiltys?: AvailabiltyTime[];

  @IsNotEmpty()
  @IsNumber()
  page: number;

  @IsNotEmpty()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsEnum(DriverStatus)
  status?: DriverStatus;

  @IsOptional()
  @IsMongoId()
  orderCityId?: string;
}
