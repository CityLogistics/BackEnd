import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Driver' })
  driver: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
