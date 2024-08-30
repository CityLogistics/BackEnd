import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInstance,
  IsNotEmpty,
  IsPhoneNumber,
  ValidateNested,
} from 'class-validator';
import { Address, OrderType } from '../entities/order.entity';

export class CreateOrderDto {
  @IsNotEmpty()
  senderName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ValidateNested()
  pickupAddress: Address;

  @IsNotEmpty()
  @IsPhoneNumber()
  pickupPhoneNumber: string;

  @IsNotEmpty()
  @IsDateString()
  pickupDate: string;

  @IsNotEmpty()
  pickuptime: string;

  @IsNotEmpty()
  recipientName: string;

  @IsNotEmpty()
  @IsInstance(Address)
  @ValidateNested()
  dropOffAddress: Address;

  @IsNotEmpty()
  @IsPhoneNumber()
  dropOffPhoneNumber: string;

  @IsNotEmpty()
  discription: string;

  @IsEnum(OrderType)
  type: OrderType;
}
