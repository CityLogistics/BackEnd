import {
  Body,
  Controller,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { randString } from 'src/common/utils';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/common/types';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN)
  createuser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create({
      ...createUserDto,
      password: randString(8),
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch()
  // @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  updateuser(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(req.user.id, updateUserDto);
  }
}
