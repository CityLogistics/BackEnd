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

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Driver.name) private driverModel: Model<Driver>,
  ) {}

  async assignOrderToDriver(orderId: string, driverId: string): Promise<Order> {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('order not found');

    const driver = await this.driverModel.findById(driverId);
    if (!driver) throw new NotFoundException('driver not found');

    order.driver = driverId;
    order.status = OrderStatus.PROCESSING;
    order.populate('driver');
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
