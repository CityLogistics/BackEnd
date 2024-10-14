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
import { UsersService } from 'src/users/users.service';
import { GetAllCitiesDto } from './dto/get-all-cities.dto';
import { GetCitiesByProvinceDto } from './dto/get-cities-by-province.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class CitiesService {
  constructor(
    @InjectModel(City.name) private cityModel: Model<City>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    @Inject(forwardRef(() => OrdersService))
    private orderService: OrdersService,
    private readonly httpService: HttpService,
    private config: ConfigService,
  ) {}

  private readonly accessKey = this.config.get('GOOGLE_MAPS_ACCESS_KEY');

  async create(createCityDto: CreateCityDto): Promise<City> {
    const createdCity = new this.cityModel({
      ...createCityDto,
    });

    // add city id to orders that don't have it but belong to this city,
    // i.e the order was created with the city before the city was added to the db
    // TODO add city id to orders
    // createdCity._id

    await this.orderService.addCityIdToUnAssingedOrders(
      createdCity.name,
      createdCity._id,
    );

    return await createdCity.save();
  }

  async findAll(getAllCitiesDto: GetAllCitiesDto): Promise<{
    count: number;
    data: City[];
  }> {
    const { provinces, page, limit } = getAllCitiesDto;

    let query: any = {};

    if (provinces) {
      query = { ...query, province: { $in: provinces } };
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

  async findCitiesByProvince(
    getCitiesByProvinceDto: GetCitiesByProvinceDto,
  ): Promise<{
    count: number;
    data: City[];
  }> {
    const { page, limit, province } = getCitiesByProvinceDto;

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

  async findCitiesByProvinceFromGoogle(province: string) {
    const query = `cities in ${province}`;
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${this.accessKey}`;

    const allCities: string[] = [];

    try {
      let moreResults = true;

      while (moreResults) {
        const response = await firstValueFrom<any>(this.httpService.get(url));
        const data = response.data;

        if (data.status === 'OK') {
          const cities = data.results.map((place) => place.name);
          allCities.push(...cities);

          // Check for next page token
          if (data.next_page_token) {
            // Wait for a short time before requesting the next page
            await new Promise((resolve) => setTimeout(resolve, 2000));
            url = `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${data.next_page_token}&key=${this.accessKey}`;
          } else {
            moreResults = false; // No more results
          }
        } else {
          console.error('Error fetching data:', data.status);
          moreResults = false; // Stop on error
        }
      }

      return allCities;
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }
}
