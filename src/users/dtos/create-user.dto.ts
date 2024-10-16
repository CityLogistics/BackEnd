import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Role } from 'src/common/types';
import { Province } from 'src/orders/entities/order.entity';

export enum Gender {
  NOT_SELECTED = 'NOT_SELECTED',
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ValidateIf((o) => o.role == Role.DRIVER)
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  driverId?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ValidateIf((o) => o.role == Role.ADMIN)
  @IsEnum(Province)
  province?: Province;

  @ValidateIf((o) => o.role != Role.SUPER_ADMIN)
  @IsArray()
  @ArrayNotEmpty() // Ensures the array is not empty
  @IsMongoId({ each: true })
  cities: string[];
}
