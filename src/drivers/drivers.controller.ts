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
} from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetDriverDto } from './dto/get-driver.dto';
import { Public } from 'src/auth/constants';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/common/types';
import { RolesGuard } from 'src/auth/roles.guard';

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
}
