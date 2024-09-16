import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionDto } from './dto/get-transaction.dto';
import { GetTransactionByDateRangeDto } from './dto/get-transaction-by-date-range.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  findAll(@Query() getTransactionDto: GetTransactionDto) {
    return this.transactionsService.findAll(getTransactionDto);
  }

  @Get('/find-by-date')
  findByDateRange(@Query() getTransactionDto: GetTransactionByDateRangeDto) {
    return this.transactionsService.findByDateRange(getTransactionDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
