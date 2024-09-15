import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESSFULL = 'SUCCESSFULL',
  FAILED = 'FAILED',
}

export enum TransactionType {
  ORDER = 'ORDER',
  REFUND = 'REFUND',
}

@Schema({ timestamps: true })
export class Transaction {
  @Prop()
  amount: number;

  @Prop()
  orderId: string;

  @Prop()
  refrence: string;

  @Prop()
  paymentIntent?: string;

  @Prop({ type: Object })
  misc?: any;

  @Prop({ default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Prop()
  transactionType: TransactionType;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
