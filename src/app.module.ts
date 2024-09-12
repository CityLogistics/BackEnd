import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { DriversModule } from './drivers/drivers.module';
import { OrdersModule } from './orders/orders.module';
import { AdminModule } from './admin/admin.module';
import { CommonModule } from './common/common.module';
import { MapModule } from './map/map.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentModule } from './payment/payment.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bullmq';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      useFactory: () => ({
        connection: {
          host: 'localhost',
          port: 6379,
        },
      }),
      inject: [ConfigService],
    }),

    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    DriversModule,
    OrdersModule,
    AdminModule,
    CommonModule,
    MapModule,
    PaymentModule,
    EmailModule,
  ],
})
export class AppModule {}
