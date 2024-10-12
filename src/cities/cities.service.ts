import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Province } from 'src/orders/entities/order.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CitiesService {
  constructor(
    @InjectModel(City.name) private cityModel: Model<City>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async create(createCityDto: CreateCityDto): Promise<City> {
    const createdCity = new this.cityModel({
      ...createCityDto,
    });

    // add city id to orders that don't have it but belong to this city,
    // i.e the order was created with the city before the city was added to the db
    // TODO add city id to orders
    return await createdCity.save();
  }

  async findAll(
    page: number,
    limit: number,
    province: Province,
  ): Promise<{
    count: number;
    data: City[];
  }> {
    let query: any = {};

    if (province) {
      query = { ...query, province };
    }

    const count = await this.cityModel
      .countDocuments(query)
      .hint({ province: 1 });

    const data = await this.cityModel
      .find(query)
      .hint({ province: 1 })
      .skip(limit * page)
      .limit(limit)
      .exec();

    return {
      count,
      data,
    };
  }

  async findOne(id: string): Promise<City> {
    const city = await this.cityModel.findById(id).exec();
    if (!city) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }
    return city;
  }

  async findOneByName(name: string, ignoreError = false): Promise<City | null> {
    const city = await this.cityModel.findOne({ name }).exec();
    if (!(city || ignoreError)) {
      throw new NotFoundException(`City with name ${name} not found`);
    }
    return city;
  }

  async update(id: string, updateCityDto: UpdateCityDto) {
    const updatedCity = await this.cityModel
      .findByIdAndUpdate(id, updateCityDto, { new: true })
      .exec();

    if (!updatedCity) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }

    return updatedCity;
  }

  async updateStatus(id: string, status: boolean) {
    const updatedCity = await this.cityModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();

    if (!updatedCity) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }

    return updatedCity;
  }

  async addAdminToCity(id: string, adminId: string) {
    await this.userService.findOneById(adminId);

    const updatedCity = await this.cityModel
      .findByIdAndUpdate(id, { $push: { admins: adminId } }, { new: true })
      .exec();

    if (!updatedCity) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }

    return updatedCity;
  }

  async removeAdminFromCity(id: string, adminId: string) {
    await this.userService.findOneById(adminId);

    const updatedCity = await this.cityModel
      .findByIdAndUpdate(id, { $pull: { admins: adminId } }, { new: true })
      .exec();

    if (!updatedCity) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }

    return updatedCity;
  }

  remove(id: number) {
    return this.cityModel.findByIdAndDelete(id).exec();
  }
}
