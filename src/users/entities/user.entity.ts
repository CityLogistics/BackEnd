import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role } from 'src/common/types';
import { Province } from 'src/orders/entities/order.entity';

@Schema({ timestamps: true })
export class User {
  @Prop()
  firstName: string;

  _id: mongoose.Schema.Types.ObjectId;

  @Prop()
  lastName: string;

  @Prop()
  password: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  image: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  dateOfBirth?: string;

  @Prop()
  gender: string;

  @Prop()
  role: Role;

  @Prop()
  driverId: string;

  @Prop()
  province?: Province;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'City' }] })
  cities: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
