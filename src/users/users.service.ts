import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...others } = createUserDto;
      const hashedPassword = bcrypt.hashSync(password, 10);
      const createdUser = new this.userModel({
        ...others,
        password: hashedPassword,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: savedPassword, ...createdUserData } = (
        await createdUser.save()
      ).toObject();
      return { ...createdUserData, password: '' };
    } catch (error) {
      throw new BadRequestException(
        error.message ?? 'An error occured, please contact support',
      );
    }
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
    return (await this.userModel.findOne({ email }).exec())?.toObject();
  }
}
