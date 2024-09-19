import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UserListener } from './listeners/user.listener';
import { EmailModule } from 'src/email/email.module';
// import { usersProvider } from './users.providers';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    EmailModule,
  ],
  providers: [UsersService, UserListener],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
