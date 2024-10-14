import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Driver, DriverStatus } from 'src/drivers/entities/driver.entity';
import { Order, OrderStatus } from 'src/orders/entities/order.entity';
import { Stat } from './entities/stat.entity';
import { UsersService } from 'src/users/users.service';
import { Gender } from 'src/users/dtos/create-user.dto';
import { Role } from 'src/common/types';
import {
  DRIVER_APPROVED,
  DRIVER_DECLINED,
  ORDER_ASSIGNED_DRIVER,
} from 'src/common/jobs';
import { DriverApprovedEvent } from 'src/drivers/events/driver-approved.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randString } from 'src/common/utils';
import { DriverDeclinedEvent } from 'src/drivers/events/driver-declined.event';
import { OrderAssignedDriverEvent } from 'src/orders/events/order-assigned-driver.event';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Driver.name) private driverModel: Model<Driver>,
    private userService: UsersService,
    private eventEmitter: EventEmitter2,
  ) {}

  async assignOrderToDriver(orderId: string, driverId: string): Promise<Order> {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('order not found');

    const driver = await this.driverModel.findById(driverId);
    if (!driver) throw new NotFoundException('driver not found');

    order.driver = driverId;
    order.status = OrderStatus.ASSIGNED;
    order.populate('driver');

    const orderAssignedDriverEvent = new OrderAssignedDriverEvent();
    orderAssignedDriverEvent.order = order;
    orderAssignedDriverEvent.email = driver.email;

    this.eventEmitter.emit(ORDER_ASSIGNED_DRIVER, orderAssignedDriverEvent);
    return order.save();
  }

  async updtateDriverStatus(
    driverId: string,
    status: DriverStatus,
  ): Promise<Driver> {
    if (!mongoose.Types.ObjectId.isValid(driverId))
      throw new BadRequestException('invalid driver id ');

    const driver = await this.driverModel.findById(driverId);
    if (!driver) throw new NotFoundException('driver not found');
    driver.status = status;

    if (status == DriverStatus.ACCEPTED) {
      const { firstName, lastName, email, phoneNumber, image } = driver;
      const password = randString(8);

      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        image,
        phoneNumber,
        dateOfBirth: new Date().toDateString(),
        gender: Gender.NOT_SELECTED,
        driverId,
        role: Role.DRIVER,
        cities: [],
        password,
      });
      driver.userId = user._id;

      const driverApprovedEvent = new DriverApprovedEvent();
      driverApprovedEvent.driver = await driver;
      driverApprovedEvent.password = password;
      this.eventEmitter.emit(DRIVER_APPROVED, driverApprovedEvent);
    } else {
      const driverDeclinedEvent = new DriverDeclinedEvent();
      driverDeclinedEvent.driver = await driver;
      this.eventEmitter.emit(DRIVER_DECLINED, driverDeclinedEvent);
    }

    return driver.save();
  }

  async getStats(): Promise<Stat> {
    const totalOrders = await this.orderModel.countDocuments(
      {},
      {
        hint: '_id_',
      },
    );
    const totalDrivers = await this.driverModel.countDocuments(
      {
        status: 'ACCEPTED',
      },
      {
        hint: '_id_',
      },
    );
    const totalOrdersInTransit = await this.orderModel.countDocuments(
      {
        status: OrderStatus.PROCESSING,
      },
      {
        hint: '_id_',
      },
    );
    const pendingOrders = await this.orderModel.countDocuments(
      {
        status: OrderStatus.PENDING_ASSIGNMENT,
      },
      {
        hint: '_id_',
      },
    );

    return {
      totalOrders,
      totalDrivers,
      totalOrdersInTransit,
      pendingOrders,
    };
  }
}
