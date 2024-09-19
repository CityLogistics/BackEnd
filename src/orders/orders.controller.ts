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
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/auth/constants';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/common/types';
import { RolesGuard } from 'src/auth/roles.guard';
import { OrderStatus } from './entities/order.entity';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(RolesGuard)
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
    @Request() req,
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
      req.user,

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
    @Request() req,
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
    return await this.ordersService.findNew(
      req.user,
      dates,
      orderTypes,
      page,
      limit,
    );
  }

  @Get('/find-by-date')
  async findByDateRange(
    @Request() req,
    @Query('startDate')
    startDate: Date,
    @Query('endDate')
    endDate: Date,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return await this.ordersService.findByDateRange(
      req.user,
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
  @Roles(Role.SUPER_ADMIN)
  async rejectOrder(@Param('id') id: string) {
    return await this.ordersService.reject(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.ordersService.update(id, updateOrderDto);
  }

  @Patch('status/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return await this.ordersService.updateStatus(id, status);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async remove(@Param('id') id: string) {
    return await this.ordersService.remove(id);
  }
}
