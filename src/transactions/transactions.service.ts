import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Model } from 'mongoose';
import { Transaction } from './entities/transaction.entity';
import { InjectModel } from '@nestjs/mongoose';
import moment from 'moment';
import { GetTransactionDto } from './dto/get-transaction.dto';
import { GetTransactionByDateRangeDto } from './dto/get-transaction-by-date-range.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const createdTransaction = (
      await this.transactionModel.create(createTransactionDto)
    ).save();
    return createdTransaction;
  }

  async findAll(getTransactionDto: GetTransactionDto): Promise<{
    count: number;
    data: Transaction[];
  }> {
    const { dates, status, transactionType, limit, page } = getTransactionDto;

    let query: any = {};

    if (status) {
      query = { ...query, status: { $in: status } };
    }

    if (transactionType) {
      query = { ...query, transactionType: { $in: transactionType } };
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

    const count = await this.transactionModel.countDocuments(query, {
      hint: '_id_',
    });

    const data = await this.transactionModel
      .find(query)
      .skip(limit * page)
      .limit(limit)
      .exec();

    return {
      count,
      data,
    };
  }

  async findByDateRange(
    getTransactionByDateRangeDto: GetTransactionByDateRangeDto,
  ): Promise<{
    count: number;
    data: Transaction[];
  }> {
    const { startDate, endDate, status, limit, page } =
      getTransactionByDateRangeDto;

    let query: any = {
      updatedAt: { $gte: startDate, $lte: endDate },
    };

    if (status) {
      query = { ...query, status: { $in: status } };
    }

    const count = await this.transactionModel.countDocuments(query, {
      hint: '_id_',
    });

    const data = await this.transactionModel
      .find(query)
      .skip(limit * page)
      .limit(limit)
      .exec();

    return {
      count,
      data,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
