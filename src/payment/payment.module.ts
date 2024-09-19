import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Order, OrderSchema } from 'src/orders/entities/order.entity';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Transaction,
  TransactionSchema,
} from 'src/transactions/entities/transaction.entity';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    TransactionsModule,
    EmailModule,
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
