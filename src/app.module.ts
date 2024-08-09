import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [OrderModule, AuthModule, UsersModule],
})
export class AppModule {}
