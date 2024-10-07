import { Injectable } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CitiesService {
  constructor(@InjectModel(City.name) private cityModel: Model<City>) {}

  create(createCityDto: CreateCityDto) {
    const createdCity = new this.cityModel({
      ...createCityDto,
    });

    return 'This action adds a new city';
  }

  findAll() {
    return `This action returns all cities`;
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
