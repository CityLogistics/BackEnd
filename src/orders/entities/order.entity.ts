import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Date } from 'mongoose';

export enum OrderStatus {
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

@Schema({ timestamps: true })
export class Order {
  @ApiProperty()
  @Prop()
  senderName: string;

  @Prop()
  email: string;

  @Prop()
  pickupAddress: string;

  @Prop()
  pickupPhoneNumber: number;

  @Prop()
  pickupDate: string;

  @Prop()
  pickuptime: string;

  @Prop()
  recipientName: string;

  @Prop()
  dropOffAddress: string;

  @Prop()
  dropOffPhoneNumber: number;

  @Prop()
  discription: string;

  @Prop({ type: Date })
  date: Date;

  @Prop()
  time: string;

  @Prop({ default: OrderStatus.PENDING_ASSIGNMENT })
  status: OrderStatus;

  @Prop()
  type: OrderType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Driver' })
  driver: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
