import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import mongoose, { Date } from 'mongoose';

export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PENDING_ASSIGNMENT = 'PENDING_ASSIGNMENT',
  IN_TRANSIT = 'IN_TRANSIT',
  COMPLETED = 'PENDING',
  PROCESSING = 'PROCESSING',
  REJECTED = 'REJECTED',
}

export enum OrderType {
  HEALTH_AND_MEDICINE = 'HEALTH_AND_MEDICINE',
  BOOK_AND_STATIONARY = 'BOOK_AND_STATIONARY',
  SERVICES_AND_INDUSTRY = 'SERVICES_AND_INDUSTRY',
  FASHION_AND_INDUSTRY = 'FASHION_AND_INDUSTRY',
  HOME_AND_LIVING = 'HOME_AND_LIVING',
  ELECTRONICS = 'ELECTRONICS',
  MOBILE_AND_PHONE = 'MOBILE_AND_PHONE',
  ACCESSORIES = 'ACCESSORIES',
}

export enum Province {
  ALBERTA = 'ALBERTA',
  BRITISH_COLUMBIA = 'BRITISH_COLUMBIA',
  MANITOBA = 'MANITOBA',
  NEW_BRUNSWICK = 'NEW_BRUNSWICK',
  NEWFOUNDLAND_AND_LABRADOR = 'NEWFOUNDLAND_AND_LABRADOR',
  NORTHWEST_TERRITORIES = 'NORTHWEST_TERRITORIES',
  NOVA_SCOTIA = 'NOVA_SCOTIA',
  NUNAVUT = 'NUNAVUT',
  ONTARIO = 'ONTARIO',
  PRINCE_EDWARD_ISLAND = 'PRINCE_EDWARD_ISLAND',
  QUEBEC = 'QUEBEC',
  SASKATCHEWAN = 'SASKATCHEWAN',
  YUKON = 'YUKON',
}

export class Address {
  @IsNotEmpty()
  @IsString()
  lat: string;
  @IsNotEmpty()
  @IsString()
  lng: string;
  @IsNotEmpty()
  @IsString()
  country: string;
  @IsNotEmpty()
  @IsString()
  address: string;
  @IsEnum(Province)
  province: Province;
  @IsString()
  placeId?: string;
}

@Schema({ timestamps: true })
export class Order {
  @ApiProperty()
  @Prop()
  senderName: string;

  @Prop()
  email: string;

  @Prop({ type: Address })
  pickupAddress: Address;

  @Prop()
  pickupPhoneNumber: string;

  @Prop()
  pickupDate: string;

  @Prop()
  pickuptime: string;

  @Prop()
  recipientName: string;

  @Prop({ type: Address })
  dropOffAddress: Address;

  @Prop()
  dropOffPhoneNumber: string;

  @Prop()
  discription: string;

  @Prop({ type: Date })
  date: Date;

  @Prop()
  time: string;

  @Prop({ default: OrderStatus.PENDING_PAYMENT })
  status: OrderStatus;

  @Prop()
  type: OrderType;

  @Prop()
  basePrice: number;

  @Prop()
  totalPrice: number;

  @Prop()
  distance: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Driver' })
  driver: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
