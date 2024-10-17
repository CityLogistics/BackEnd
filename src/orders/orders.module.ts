import { forwardRef, Module } from '@nestjs/common';
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
import { OrderListener } from './listeners/order.listener';
import { EmailModule } from 'src/email/email.module';
import { CitiesModule } from 'src/cities/cities.module';

@Module({
  imports: [
    MapModule,
    PaymentModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    EmailModule,
    forwardRef(() => CitiesModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderListener],
  exports: [OrdersService, OrderListener],
})
export class OrdersModule {}
