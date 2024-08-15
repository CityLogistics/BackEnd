import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  senderName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  pickupAddress: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  pickupPhoneNumber: number;

  @IsNotEmpty()
  @IsDateString()
  pickupDate: string;

  @IsNotEmpty()
  pickuptime: string;

  @IsNotEmpty()
  recipientName: string;

  @IsNotEmpty()
  dropOffAddress: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  dropOffPhoneNumber: number;

  @IsNotEmpty()
  discription: string;
}
