import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class City {
  @Prop({ unique: true })
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }] })
  drivers: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  admins: string[];
}

export const CitySchema = SchemaFactory.createForClass(City);
