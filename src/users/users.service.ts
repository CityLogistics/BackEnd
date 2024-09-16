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
    const password = 'password';
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const createdUser = new this.userModel({
        ...createUserDto,
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

  async updatePassword(
    id: string,
    password: string,
    newPassword: string,
  ): Promise<any> {
    try {
      const user = await this.userModel.findById(id).exec();

      if (!bcrypt.compareSync(password, user.password))
        throw new BadRequestException('invalid password');
      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

      user.password = hashedNewPassword;
      user.save();

      return { message: 'password saved' };
    } catch (error) {
      throw new BadRequestException(
        error.message ?? 'An error occured, please contact support',
      );
    }
  }
}
