import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop()
  firstName: string;

  @Prop()
  _id: mongoose.Schema.Types.ObjectId;

  @Prop()
  lastName: string;

  @Prop()
  password: string;

  @Prop()
  email: string;

  @Prop()
  image: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  dateOfBirth: string;

  @Prop()
  gender: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
