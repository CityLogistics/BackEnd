import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Role } from 'src/common/types';
import { ADMIN_CREATED } from 'src/common/jobs';
import { UserCreatedEvent } from './events/user-created.event';
import { CitiesService } from 'src/cities/cities.service';
import { UpdateUserCitiesDto } from './dtos/update-user-cities.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => CitiesService))
    private citiesService: CitiesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, role, cities, ...others } = createUserDto;
    // if (role == Role.SUPER_ADMIN) {
    //   const superAdmin = await this.userModel
    //     .findOne({
    //       role: Role.SUPER_ADMIN,
    //     })
    //     .exec();
    //   if (superAdmin)
    //     throw new BadRequestException('Super Admin already exists');
    // }
    try {
      if (role != Role.SUPER_ADMIN)
        await Promise.all(
          cities.map((city) => this.citiesService.findOne(city)),
        );

      const hashedPassword = bcrypt.hashSync(password, 10);

      const createdUser = new this.userModel({
        ...others,
        role,
        password: hashedPassword,
        cities,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: savedPassword, ...createdUserData } = (
        await createdUser.save()
      ).toObject();

      if (role != Role.SUPER_ADMIN)
        await Promise.all(
          cities.map((city) =>
            this.citiesService.addAdminToCity(city, createdUser.id),
          ),
        );

      if (role == Role.ADMIN || role == Role.SUPER_ADMIN) {
        const adminCreatedEvent = new UserCreatedEvent();
        adminCreatedEvent.user = await createdUser;
        adminCreatedEvent.password = password;
        this.eventEmitter.emit(ADMIN_CREATED, adminCreatedEvent);
      }

      return { ...createdUserData, password: '' };
    } catch (error) {
      if (error.code == 11000)
        throw new BadRequestException('User with email already exists');

      throw new BadRequestException(
        error.message ?? 'An error occured, please contact support',
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const createdUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      {
        new: true,
      },
    );
    return createdUser;
  }

  async updateAdminCities(
    adminId: string,
    updateUserCitiesDto: UpdateUserCitiesDto,
  ): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { cities } = updateUserCitiesDto;
    await Promise.all(
      updateUserCitiesDto.cities.map((city) =>
        this.citiesService.addAdminToCity(city, adminId),
      ),
    );

    const createdUser = await this.userModel.findByIdAndUpdate(
      adminId,
      { cities },
      {
        new: true,
      },
    );
    return createdUser;
  }

  async findOne(email: string): Promise<User | undefined> {
    return (await this.userModel.findOne({ email }).exec())?.toObject();
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findAll(
    roles: string[],
    page: number,
    limit: number,
  ): Promise<{
    count: number;
    data: User[];
  }> {
    let query: any = {
      role: { $ne: 'DRIVER' },
    };

    if (roles) {
      query = {
        ...query,
        role: {
          $in: roles,
          // $in: dates,
        },
      };
    }

    const count = await this.userModel.countDocuments(query, { hint: '_id_' });

    const data = await this.userModel
      .find(query)
      .skip(limit * page)
      .limit(limit)
      .exec();

    return {
      count,
      data,
    };
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

  async delete(id: string): Promise<boolean> {
    const user = await this.userModel.findById(id);

    if (!user) throw new BadRequestException('User not found');
    if (user.role == Role.SUPER_ADMIN)
      throw new BadRequestException('Super Admin cannot be deleted');
    user.deleteOne().exec();
    return true;
  }
}
