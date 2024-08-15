import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import usersConstants from './users.contants';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @Inject(usersConstants.USER_MODEL) private userModel: Model<User>,
  ) {}

  async create(createUserDto: any): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne().exec();
  }
}
