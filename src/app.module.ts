import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import dbConstants from './db/db.constants';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { DriversModule } from './drivers/drivers.module';
import { OrdersModule } from './orders/orders.module';
import { AdminModule } from './admin/admin.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    MongooseModule.forRoot(dbConstants.CONNECTION_STRING),
    DriversModule,
    OrdersModule,
    AdminModule,
    CommonModule,
  ],
})
export class AppModule {}
