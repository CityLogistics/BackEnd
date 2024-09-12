import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Driver, DriverSchema } from './entities/driver.entity';
import { DriverCreatedListener } from './listeners/driver-created.listener';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Driver.name, schema: DriverSchema }]),
    EmailModule,
  ],
  controllers: [DriversController],
  providers: [DriversService, DriverCreatedListener],
})
export class DriversModule {}
