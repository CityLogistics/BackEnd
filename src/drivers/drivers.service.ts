import { Injectable } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Driver } from './entities/driver.entity';
import { Model } from 'mongoose';

@Injectable()
export class DriversService {
  constructor(@InjectModel(Driver.name) private driverModel: Model<Driver>) {}

  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    const createdDriver = await this.driverModel.create(createDriverDto);
    return createdDriver.save();
  }

  async findAll(): Promise<Driver[]> {
    return await this.driverModel.find().exec();
  }

  async findOne(id: string): Promise<Driver> {
    return await this.driverModel.findById(id).exec();
  }

  async update(id: number, updateDriverDto: UpdateDriverDto): Promise<Driver> {
    return await this.driverModel.findByIdAndUpdate(id, updateDriverDto).exec();
  }

  async remove(id: number) {
    return await this.driverModel.findByIdAndDelete(id).exec();
  }
}
