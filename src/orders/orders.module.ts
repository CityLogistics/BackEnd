import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.entity';
import { MapModule } from 'src/map/map.module';
import { PaymentModule } from 'src/payment/payment.module';
import {
  Transaction,
  TransactionSchema,
} from 'src/transactions/entities/transaction.entity';

@Module({
  imports: [
    MapModule,
    PaymentModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
