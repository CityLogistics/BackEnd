import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { usersProvider } from './users.providers';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  providers: [UsersService, ...usersProvider],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
