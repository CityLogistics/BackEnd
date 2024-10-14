import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/common/types';
import { ObjectIdPipe } from 'src/common/pipes/mongoose_object_id.pipe';
import { GetAllCitiesDto } from './dto/get-all-cities.dto';
import { GetCitiesByProvinceDto } from './dto/get-cities-by-province.dto';

@ApiTags('cities')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN)
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN)
  findAll(
    @Query()
    getAllCitiesDto: GetAllCitiesDto,
  ) {
    return this.citiesService.findAll(getAllCitiesDto);
  }

  @Get('find-by-province')
  @Roles(Role.SUPER_ADMIN)
  findCitiesByProvince(
    @Query()
    getCitiesByProvinceDto: GetCitiesByProvinceDto,
  ) {
    return this.citiesService.findCitiesByProvince(getCitiesByProvinceDto);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN)
  findOne(@Param('id', new ObjectIdPipe('id')) id: string) {
    return this.citiesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN)
  update(
    @Param('id', new ObjectIdPipe('id')) id: string,
    @Body() updateCityDto: UpdateCityDto,
  ) {
    return this.citiesService.update(id, updateCityDto);
  }

  @Patch(':id/update-status')
  @Roles(Role.SUPER_ADMIN)
  updateStatus(
    @Param('id', new ObjectIdPipe('id')) id: string,
    @Body('status', ParseBoolPipe) status: boolean,
  ) {
    return this.citiesService.updateStatus(id, status);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.citiesService.remove(+id);
  }
}
