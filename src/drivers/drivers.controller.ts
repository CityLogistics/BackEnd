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
  Request,
  ParseEnumPipe,
  BadRequestException,
} from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetDriverDto } from './dto/get-driver.dto';
import { Public } from 'src/auth/constants';
import { Roles } from 'src/auth/role.decorator';
import { Decision, Role } from 'src/common/types';
import { RolesGuard } from 'src/auth/roles.guard';
import { OrderStatus } from 'src/orders/entities/order.entity';

@ApiTags('drivers')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Public()
  @Post()
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driversService.create(createDriverDto);
  }

  @Get('me')
  @Roles(Role.DRIVER)
  getMe(@Request() req) {
    return this.driversService.findMe(req.user.id);
  }

  @Patch('me/update')
  @Roles(Role.DRIVER)
  updateMe(@Request() req, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driversService.updateMe(req.user.id, updateDriverDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  findAll(
    @Query()
    getDriverDto: GetDriverDto,
  ) {
    return this.driversService.findAll(getDriverDto);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN)
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driversService.update(+id, updateDriverDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.driversService.remove(+id);
  }

  @ApiBody({ type: Object })
  @Patch('decide-order-assignment/:id')
  @Roles(Role.DRIVER)
  rejectOrderAssignment(
    @Param('id') id: string,
    @Request() req,
    @Body(
      'action',
      new ParseEnumPipe(Decision, {
        exceptionFactory: () => {
          throw new BadRequestException(`invalid action value`);
        },
      }),
    )
    action: Decision,
  ) {
    return this.driversService.decideOrderAssignment(req.user, id, action);
  }

  @Patch('order/:id')
  @Roles(Role.DRIVER)
  async updateDriverOrderStatus(
    @Param('id') id: string,
    @Request() req,
    @Body('status') status: OrderStatus,
  ) {
    return await this.driversService.updateOrderStatus(req.user, id, status);
  }
}
