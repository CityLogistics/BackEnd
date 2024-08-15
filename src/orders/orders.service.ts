import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './entities/order.entity';
import { Model } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel(createOrderDto);
    return await createdOrder.save();
  }

  async findAll(): Promise<Order[]> {
    return await this.orderModel.find().populate('driver').exec();
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
