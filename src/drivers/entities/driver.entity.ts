import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @Prop({ required: true })
  firstName: string;

  @ApiProperty()
  @Prop({ required: true })
  lastName: string;

  @ApiProperty()
  @Prop({ required: true })
  email: string;

  @ApiProperty()
  @Prop({ required: true })
  phoneNumber: string;

  @ApiProperty()
  @Prop({ required: true })
  image: string;

  @ApiProperty()
  @Prop({ required: true })
  ownVehicle: boolean;

  @ApiProperty()
  @Prop()
  vehicleType: VehicleType;

  @ApiProperty()
  @Prop({ required: true })
  hasValidLicense: boolean;

  @ApiProperty()
  @Prop({ required: true })
  hasValidVehicleInsurance: boolean;

  @ApiProperty()
  @Prop({ default: DriverStatus.PENDING })
  status: DriverStatus;

  @ApiProperty()
  @Prop()
  availabiltyDays: AvailabiltyDay[];

  @ApiProperty()
  @Prop()
  availabiltyTime: AvailabiltyTime[];

  @ApiProperty()
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }] })
  orders: string[];

  @Prop()
  userId: mongoose.Schema.Types.ObjectId;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
