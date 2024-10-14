import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderStatus } from './entities/order.entity';
import { Model, ObjectId } from 'mongoose';
import * as moment from 'moment';
import { pricePerKm, regionalPrices } from 'src/common/prices';
import { MapService } from 'src/map/map.service';
import { PaymentService } from 'src/payment/payment.service';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/common/types';
import { OrderCreatedEvent } from './events/order-created.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderRejectedAdminEvent } from './events/order-rejected-admin.event';
import {
  ORDER_COMPLETED,
  ORDER_CREATED,
  ORDER_REJECTED_ADMIN,
} from 'src/common/jobs';
import { OrderCompletedEvent } from './events/order-completed';
import { CitiesService } from 'src/cities/cities.service';
// import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    private mapService: MapService,
    @Inject(forwardRef(() => CitiesService))
    private citiesService: CitiesService,
    // private usersService: UsersService,
    private paymentService: PaymentService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
  ): Promise<{ order: Order; paymentUrl: string }> {
    const pickupDate = moment(createOrderDto.pickupDate)
      .startOf('day')
      .toString();
    const { pickupAddress, dropOffAddress } = createOrderDto;

    const assignedCity = await this.citiesService.findOneByName(
      pickupAddress.city,
      true,
    );

    const basePrice = Math.max(
      regionalPrices[pickupAddress.province],
      regionalPrices[dropOffAddress.province],
    );

    // const vehiclePrice = vehiclePrices[vehicleType];

    const distance = await this.mapService.getDistance(
      { lat: pickupAddress.lat, lng: pickupAddress.lng },
      { lat: dropOffAddress.lat, lng: dropOffAddress.lng },
    );
    // { lat: 50.454722, lng: -104.606667 },
    // { lat: 51.454722, lng: -104.606667 },
    const totalPrice = basePrice + Math.ceil(distance / 1000) * pricePerKm;
    const createdOrder = new this.orderModel({
      ...createOrderDto,
      pickupDate,
      distance: Math.ceil(distance / 1000),
      basePrice,
      totalPrice,
      assignedCityId: assignedCity?._id,
    });
    const paymentUrl = await this.paymentService.createCheckout(
      totalPrice,
      createdOrder.id,
    );
    const order = await createdOrder.save();

    const orderCreatedEvent = new OrderCreatedEvent();
    orderCreatedEvent.order = await order;
    orderCreatedEvent.paymentUrl = paymentUrl;

    this.eventEmitter.emit(ORDER_CREATED, orderCreatedEvent);

    return {
      order,
      paymentUrl,
    };
  }

  async findAll(
    user: Partial<User>,
    dates: string[],
    orderTypes: string[],
    orderStatus: string[],
    page: number,
    limit: number,
    search: string,
  ): Promise<{
    count: number;
    data: Order[];
  }> {
    let query: any = {
      status: { $ne: 'PENDING_ASSIGNMENT' },
    };

    if (user.role == Role.ADMIN) {
      query = {
        ...query,
        'pickupAddress.province': user.province,
        assignedCityId: { $in: user.cities ?? [] },
      };
    }

    if (user.role == Role.DRIVER) {
      query = {
        ...query,
        driver: user.driverId,
      };
    }

    if (dates) {
      query = {
        ...query,
        pickupDate: {
          $in: dates.map((v) => moment(v).startOf('day').toString()),
          // $in: dates,
        },
      };
    }

    if (orderTypes) {
      query = { ...query, type: { $in: orderTypes } };
    }

    if (orderStatus) {
      query = { ...query, status: { $in: orderStatus } };
    }

    if (search) {
      query = {
        ...query,
        $text: { $search: search },
      };
    }

    const count = await this.orderModel.countDocuments(query);

    const data = await this.orderModel
      .find(query)
      .skip(limit * page)
      .limit(limit)
      .populate('driver')
      .exec();

    return {
      count,
      data,
    };
  }

  async findByDateRange(
    user: Partial<User>,
    startDate: Date,
    endDate: Date,
    page: number,
    limit: number,
  ): Promise<{
    count: number;
    data: Order[];
  }> {
    let query: any = {
      status: { $ne: 'PENDING_ASSIGNMENT' },
      updatedAt: { $gte: startDate, $lte: endDate },
    };
    if (user.role == Role.ADMIN) {
      query = {
        ...query,
        'pickupAddress.province': user.province,
      };
    }

    if (user.role == Role.DRIVER) {
      query = {
        ...query,
        driver: user.driverId,
      };
    }

    const count = await this.orderModel.countDocuments(query, { hint: '_id_' });

    const data = await this.orderModel
      .find(query)
      .skip(limit * page)
      .limit(limit)
      .exec();

    return {
      count,
      data,
    };
  }

  async findNew(
    user: Partial<User>,
    dates: string[],
    orderTypes: string[],
    page: number,
    limit: number,
  ): Promise<{
    count: number;
    data: Order[];
  }> {
    let query: any = {
      status: 'PENDING_ASSIGNMENT',
    };

    if (user.role == Role.ADMIN) {
      query = {
        ...query,
        'pickupAddress.province': user.province,
      };
    }

    if (user.role == Role.DRIVER) {
      query = {
        ...query,
        driver: user.driverId,
      };
    }

    if (dates) {
      query = {
        ...query,
        pickupDate: {
          $in: dates.map((v) => moment(v).startOf('day').toString()),
          // $in: dates,
        },
      };
    }

    if (orderTypes) {
      query = { ...query, type: { $in: orderTypes } };
    }

    const count = await this.orderModel.countDocuments(query, { hint: '_id_' });

    const data = await this.orderModel
      .find(query)
      .skip(limit * page)
      .limit(limit)
      .populate('driver')
      .exec();

    return {
      count,
      data,
    };
  }

  async findOne(id: string): Promise<Order> {
    return await this.orderModel.findById(id).populate('driver').exec();
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto)
      .populate('driver')
      .exec();

    return order;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.orderModel
      .findByIdAndUpdate(id, { status })
      .populate('driver')
      .exec();

    if (status == OrderStatus.COMPLETED) {
      const orderCompletedEvent = new OrderCompletedEvent();
      orderCompletedEvent.order = order;

      this.eventEmitter.emit(ORDER_COMPLETED, orderCompletedEvent);
    }

    return order;
  }

  async reject(id: string): Promise<{ order: Order; status: string }> {
    try {
      const order = await this.orderModel
        .findByIdAndUpdate(id, { status: OrderStatus.REJECTED })
        .exec();

      const tranaction = await this.transactionModel.findOne({
        refrence: order.tranasctionReference,
      });

      if (!tranaction) throw new BadRequestException('Transaction not found');

      const refund = await this.paymentService.issueRefund(
        tranaction.paymentIntent,
      );

      const orderRejectedAdminEvent = new OrderRejectedAdminEvent();
      orderRejectedAdminEvent.order = await order;

      this.eventEmitter.emit(ORDER_REJECTED_ADMIN, orderRejectedAdminEvent);

      return { order, status: refund };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    order.deleteOne();
    return order;
  }

  async addCityIdToUnAssingedOrders(city: string, assignedCityId: ObjectId) {
    const orders = await this.orderModel
      .updateMany(
        { 'pickupAddress.city': city },
        { assignedCityId },
        { new: true },
      )
      .exec();

    //TODO send emails

    return orders;
  }
}
