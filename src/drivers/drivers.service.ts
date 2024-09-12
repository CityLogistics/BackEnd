import { Injectable } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Driver } from './entities/driver.entity';
import { Model } from 'mongoose';
import { GetDriverDto } from './dto/get-driver.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DriverCreatedEvent } from './events/driver-created.event';

@Injectable()
export class DriversService {
  constructor(
    @InjectModel(Driver.name) private driverModel: Model<Driver>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    const createdDriver = (
      await this.driverModel.create(createDriverDto)
    ).save();

    const driverCreatedEvent = new DriverCreatedEvent();
    driverCreatedEvent.driver = await createdDriver;

    this.eventEmitter.emit('driver.created', driverCreatedEvent);

    return createdDriver;
  }

  async findAll(getDriverDto: GetDriverDto): Promise<{
    count: number;
    data: Driver[];
  }> {
    const { limit, page, days, carTypes, availabiltys, status } = getDriverDto;

    let query: any = {};

    if (status) {
      query = { ...query, status };
    }

    if (days) {
      query = { ...query, availabiltyDays: { $in: days } };
    }

    if (carTypes) {
      query = { ...query, vehicleType: { $in: carTypes } };
    }

    if (availabiltys) {
      query = { ...query, availabiltyTime: { $in: availabiltys } };
    }

    const count = await this.driverModel.countDocuments(query, {
      hint: '_id_',
    });

    const data = await this.driverModel
      .find()
      .find(query)
      .skip(limit * page)
      .limit(limit)
      .exec();
    return {
      count,
      data,
    };
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
