import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Schema as MSchema } from 'mongoose';
import { Province } from 'src/orders/entities/order.entity';

@Schema({ timestamps: true })
export class City {
  @Prop({ unique: true })
  name: string;

  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [{ type: MSchema.Types.ObjectId, ref: 'Driver' }] })
  drivers: string[];

  @Prop({ type: [{ type: MSchema.Types.ObjectId, ref: 'User' }] })
  admins: string[];

  @Prop({ type: String, enum: Province })
  province: Province;

  @Prop({ default: true })
  status: boolean;
}

export const CitySchema = SchemaFactory.createForClass(City);

CitySchema.index({ province: 1 });
