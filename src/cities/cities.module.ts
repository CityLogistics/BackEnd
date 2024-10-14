import { forwardRef, Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { City, CitySchema } from './entities/city.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
    forwardRef(() => UsersModule),
  ],
  controllers: [CitiesController],
  providers: [CitiesService],
  exports: [CitiesService],
})
export class CitiesModule {}
