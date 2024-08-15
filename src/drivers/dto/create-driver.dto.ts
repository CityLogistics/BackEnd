import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

enum VehicleType {
  SALON = 'SALON',
  SEDAN = 'SEDAN',
}

export class CreateDriverDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phoneNumber: number;

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
  availabiltyDays: string[];

  @IsString()
  @IsNotEmpty()
  availabiltyTime: string;

  @IsString()
  @IsNotEmpty()
  preferredTimeZone: string;
}
