import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './entities/order.entity';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { pricePerKm, regionalPrices } from 'src/common/prices';
import { MapService } from 'src/map/map.service';
import { PaymentService } from 'src/payment/payment.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private mapService: MapService,
    private paymentService: PaymentService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const pickupDate = moment(createOrderDto.pickupDate)
      .startOf('day')
      .toString();
    const { pickupAddress, dropOffAddress } = createOrderDto;
    const basePrice = Math.max(
      regionalPrices[pickupAddress.province],
      regionalPrices[dropOffAddress.province],
    );
    const distance = await this.mapService.getDistance(
      { lat: 50.454722, lng: -104.606667 },
      { lat: 51.454722, lng: -104.606667 },
    );
    const totalPrice = basePrice + Math.ceil(distance / 1000) * pricePerKm;
    console.info({ basePrice, distance });
    const createdOrder = new this.orderModel({
      ...createOrderDto,
      pickupDate,
      distance,
      basePrice,
      totalPrice,
    });
    const paymentUrl = await this.paymentService.createCheckout(
      totalPrice,
      createdOrder.id,
    );
    console.info({ paymentUrl });
    return await createdOrder.save();
  }

  async findAll(
    dates: string[],
    orderTypes: string[],
    orderStatus: string[],
    page: number,
    limit: number,
  ): Promise<{
    count: number;
    data: Order[];
  }> {
    let query: any = {
      status: { $ne: 'PENDING_ASSIGNMENT' },
    };

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

  async findByDateRange(
    startDate: Date,
    endDate: Date,
    page: number,
    limit: number,
  ): Promise<{
    count: number;
    data: Order[];
  }> {
    const query: any = {
      status: { $ne: 'PENDING_ASSIGNMENT' },
      updatedAt: { $gte: startDate, $lte: endDate },
    };

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

  async remove(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    order.deleteOne();
    return order;
  }
}
