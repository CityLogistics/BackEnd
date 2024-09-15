import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseArrayPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/auth/constants';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.ordersService.create(createOrderDto);
  }

  @ApiQuery({
    name: 'dates',
    type: 'array',
    required: false,
  })
  @ApiQuery({
    name: 'orderTypes',
    type: 'array',
    required: false,
  })
  @ApiQuery({
    name: 'orderStatus',
    type: 'array',
    required: false,
  })
  @Get()
  async findAll(
    @Query(
      'dates',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    dates: string[],
    @Query(
      'orderTypes',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    orderTypes: string[],
    @Query(
      'orderStatus',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    orderStatus: string[],
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return await this.ordersService.findAll(
      dates,
      orderTypes,
      orderStatus,
      page,
      limit,
    );
  }

  @ApiQuery({
    name: 'dates',
    type: 'array',
    required: false,
  })
  @ApiQuery({
    name: 'orderTypes',
    type: 'array',
    required: false,
  })
  @Get('new')
  async findNew(
    @Query(
      'dates',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    dates: string[],
    @Query(
      'orderTypes',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    orderTypes: string[],
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return await this.ordersService.findNew(dates, orderTypes, page, limit);
  }

  @Get('/find-by-date')
  async findByDateRange(
    @Query('startDate')
    startDate: Date,
    @Query('endDate')
    endDate: Date,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return await this.ordersService.findByDateRange(
      startDate,
      endDate,
      page,
      limit,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ordersService.findOne(id);
  }

  @Post('reject/:id')
  async rejectOrder(@Param('id') id: string) {
    return await this.ordersService.reject(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.ordersService.remove(id);
  }
}
