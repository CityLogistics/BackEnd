import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Driver } from './entities/driver.entity';
import { Model } from 'mongoose';
import { GetDriverDto } from './dto/get-driver.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DriverCreatedEvent } from './events/driver-created.event';
import { Order, OrderStatus } from 'src/orders/entities/order.entity';
import { Decision } from 'src/common/types';
import {
  ORDER_ACCEPTED_DRIVER,
  ORDER_DELIVERED,
  ORDER_REJECTED_DRIVER,
} from 'src/common/jobs';
import { OrderRejectedDriverEvent } from 'src/orders/events/order-rejected-driver.event';
import { OrderAcceptedDriverEvent } from 'src/orders/events/order-accepted-driver.event';
import { OrderDeliveredEvent } from 'src/orders/events/order-delivered';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class DriversService {
  constructor(
    @InjectModel(Driver.name) private driverModel: Model<Driver>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    // const createdDriver = (
    //   await this.driverModel.create(createDriverDto)
    // ).save();

    const driverExists = await this.driverModel.findOne({
      email: createDriverDto.email,
    });

    const userExists = await this.userModel.findOne({
      email: createDriverDto.email,
    });

    if (userExists || driverExists)
      throw new BadRequestException('User with email already exists');

    const createdDriver = new this.driverModel(createDriverDto);

    const driverCreatedEvent = new DriverCreatedEvent();
    driverCreatedEvent.driver = createdDriver;

    this.eventEmitter.emit('driver.created', driverCreatedEvent);

    return createdDriver.save();
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
  async findMe(id: string): Promise<Driver> {
    const driver = await this.driverModel.findOne({ userId: id }).exec();
    if (!driver) throw new NotFoundException('driver not found');

    return driver;
  }

  async updateMe(
    id: string,
    updateDriverDto: UpdateDriverDto,
  ): Promise<Driver> {
    const driver = await this.driverModel.findOne({ userId: id });

    if (!driver) throw new NotFoundException('driver not found');
    return driver.updateOne(updateDriverDto).exec();
    // return await this.driverModel.findByIdAndUpdate(id, updateDriverDto).exec();
  }

  async update(id: number, updateDriverDto: UpdateDriverDto): Promise<Driver> {
    const driver = await this.driverModel.findById(id);

    if (!driver) throw new NotFoundException('driver not found');
    return driver.updateOne(updateDriverDto).exec();
    // return await this.driverModel.findByIdAndUpdate(id, updateDriverDto).exec();
  }

  async findOne(id: string): Promise<Driver> {
    const driver = await this.driverModel.findById(id).exec();
    if (!driver) throw new NotFoundException('driver not found');

    return driver;
  }

  async remove(id: number) {
    return await this.driverModel.findByIdAndDelete(id).exec();
  }

  async decideOrderAssignment(user, orderId, action: Decision): Promise<Order> {
    const order = await this.orderModel.findOne({
      _id: orderId,
      driver: user.driverId,
      status: OrderStatus.ASSIGNED,
    });
    if (!order) throw new NotFoundException('order not found');

    if (action == Decision.DECLINE) {
      order.driver = null;
      order.status = OrderStatus.PENDING_ASSIGNMENT;
      const orderAssignedDriverEvent = new OrderRejectedDriverEvent();
      orderAssignedDriverEvent.order = await order;
      orderAssignedDriverEvent.driverName = user.firstName;

      this.eventEmitter.emit(ORDER_REJECTED_DRIVER, orderAssignedDriverEvent);
    } else {
      order.status = OrderStatus.PROCESSING;
      const orderAssignedDriverEvent = new OrderAcceptedDriverEvent();
      orderAssignedDriverEvent.order = await order;
      orderAssignedDriverEvent.driverName = user.firstName;

      this.eventEmitter.emit(ORDER_ACCEPTED_DRIVER, orderAssignedDriverEvent);
    }
    return order.save();
  }

  async updateOrderStatus(user, orderId, status: OrderStatus): Promise<Order> {
    const order = await this.orderModel.findOne({
      _id: orderId,
      driver: user.driverId,
      status: OrderStatus.PROCESSING,
    });
    if (!order) throw new NotFoundException('order not found');

    if (status == OrderStatus.DELIVERED) {
      order.status = status;
      const orderDeliveredEvent = new OrderDeliveredEvent();
      orderDeliveredEvent.order = order;
      orderDeliveredEvent.driverName = user.firstName;

      this.eventEmitter.emit(ORDER_DELIVERED, orderDeliveredEvent);
    } else {
      throw new BadRequestException('Invalid order status');
    }
    return order.save();
  }
}
