import { Injectable } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Province } from 'src/orders/entities/order.entity';

@Injectable()
export class CitiesService {
  constructor(@InjectModel(City.name) private cityModel: Model<City>) {}

  async create(createCityDto: CreateCityDto): Promise<City> {
    const createdCity = new this.cityModel({
      ...createCityDto,
    });

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

  findOne(id: number) {
    return `This action returns a #${id} city`;
  }

  update(id: number, updateCityDto: UpdateCityDto) {
    return `This action updates a #${id} city`;
  }

  remove(id: number) {
    return `This action removes a #${id} city`;
  }
}
