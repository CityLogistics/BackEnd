import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
// import { User } from './entities/user.entity';
// import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  // @Post()
  // createuser(@Body() createUserDto: CreateUserDto): Promise<User> {
  //   return this.userService.create(createUserDto);
  // }
}
