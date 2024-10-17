import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  ValidateIf,
} from 'class-validator';
import {
  AvailabiltyDay,
  AvailabiltyTime,
  VehicleType,
} from '../entities/driver.entity';

export class CreateDriverDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsBoolean()
  ownVehicle: boolean;

  @ValidateIf((o) => o.ownVehicle)
  @IsEnum(VehicleType)
  vehicleType: VehicleType;

  @IsNotEmpty()
  @IsBoolean()
  hasValidLicense: boolean;

  @IsNotEmpty()
  @IsBoolean()
  hasValidVehicleInsurance: boolean;

  @IsNotEmpty()
  @IsArray()
  availabiltyDays: AvailabiltyDay[];

  @IsArray()
  @IsNotEmpty()
  availabiltyTime: AvailabiltyTime[];

  @IsString()
  @IsNotEmpty()
  preferredTimeZone: string;

  @IsArray()
  @ArrayNotEmpty() // Ensures the array is not empty
  @IsMongoId({ each: true })
  cities: string[];
}
