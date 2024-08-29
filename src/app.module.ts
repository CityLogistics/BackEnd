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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        // uri: "mongodb+srv://Cluster85411:HZWFBVepJ3XnsrAp@cluster85411.mvcugid.mongodb.net/?retryWrites=true&w=majority&appName=Cluster85411",
      }),
      inject: [ConfigService],
    }),
    DriversModule,
    OrdersModule,
    AdminModule,
    CommonModule,
    MapModule,
  ],
})
export class AppModule {}
