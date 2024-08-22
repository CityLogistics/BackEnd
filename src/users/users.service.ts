import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import usersConstants from './users.contants';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(usersConstants.USER_MODEL) private userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, ...others } = updateUserDto;

    if (email) throw new BadRequestException('Email cannot be changed');

    const createdUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      {
        new: true,
      },
    );
    return createdUser;
  }

  async findOne(email: string): Promise<User | undefined> {
    return (await this.userModel.findOne({ email }).exec()).toObject();
  }
}
