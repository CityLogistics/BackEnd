import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export enum DriverStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export enum VehicleType {
  SALON = 'SALON',
  FIVE_SEATER_SUV = 'FIVE_SEATER_SUV',
  SEVEN_SEATER_SUV = 'SEVEN_SEATER_SUV',
  VAN = 'VAN',
  TRUCK = 'TRUCK',
}

export enum AvailabiltyDay {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export enum AvailabiltyTime {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT',
}

@Schema({ timestamps: true })
export class Driver {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  image: string;

  @Prop()
  ownVehicle: boolean;

  @Prop()
  vehicleType: VehicleType;

  @Prop()
  hasValidLicense: boolean;

  @Prop()
  hasValidVehicleInsurance: boolean;

  @Prop({ default: DriverStatus.PENDING })
  status: DriverStatus;

  @Prop()
  availabiltyDays: AvailabiltyDay[];

  @Prop()
  availabiltyTime: AvailabiltyTime[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }] })
  orders: string[];

  @Prop()
  userId: mongoose.Schema.Types.ObjectId;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
