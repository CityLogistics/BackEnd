import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { randString } from 'src/common/utils';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/common/types';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdateUserCitiesDto } from './dtos/update-user-cities.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN)
  createuser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create({
      ...createUserDto,
      password: createUserDto.password ?? randString(8),
    });
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiQuery({
    name: 'roles',
    type: 'array',
    required: false,
  })
  getUsers(
    @Query(
      'roles',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    roles: string[],
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<any> {
    return this.userService.findAll(roles, page, limit);
  }

  @Patch()
  // @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  updateuser(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Patch(':id/update-cities')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  updateAdminCities(
    @Param('id') id: string,
    @Body() updateUserCitiesDto: UpdateUserCitiesDto,
  ): Promise<User> {
    return this.userService.updateAdminCities(id, updateUserCitiesDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  deleteUser(@Param('id') id: string): Promise<boolean> {
    return this.userService.delete(id);
  }
}
