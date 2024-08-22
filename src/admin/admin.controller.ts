import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Order } from 'src/orders/entities/order.entity';
import { Driver, DriverStatus } from 'src/drivers/entities/driver.entity';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ObjectIdPipe } from 'src/common/pipes/mongoose_object_id.pipe';
import { Stat } from './entities/stat.entity';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Patch('/order/:orderId/asign-driver/:driverId')
  async assignOrderToDriver(
    @Param('orderId', new ObjectIdPipe('orderId')) orderId: string,
    @Param('driverId', new ObjectIdPipe('driverId')) driverId: string,
  ): Promise<Order> {
    return await this.adminService.assignOrderToDriver(orderId, driverId);
  }

  @ApiBody({ type: Object })
  @Patch('/driver/:driverId')
  async updtateDriverStatus(
    @Param('driverId') driverId: string,
    @Body(
      'status',
      new ParseEnumPipe(DriverStatus, {
        exceptionFactory: () => {
          throw new BadRequestException(`invalid status value`);
        },
      }),
    )
    status: DriverStatus,
  ): Promise<Driver> {
    return await this.adminService.updtateDriverStatus(driverId, status);
  }

  @Get('/stats')
  async getStats(): Promise<Stat> {
    return await this.adminService.getStats();
  }
}
