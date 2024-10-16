import { forwardRef, Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Driver, DriverSchema } from './entities/driver.entity';
import { DriverListener } from './listeners/driver.listener';
import { EmailModule } from 'src/email/email.module';
import { Order, OrderSchema } from 'src/orders/entities/order.entity';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { CitiesModule } from 'src/cities/cities.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Driver.name, schema: DriverSchema },
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
    ]),
    EmailModule,
    forwardRef(() => CitiesModule),
  ],
  controllers: [DriversController],
  providers: [DriversService, DriverListener],
})
export class DriversModule {}
