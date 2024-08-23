import { Controller, Get } from '@nestjs/common';
import { MapService } from './map.service';

@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get()
  async address() {
    return await this.mapService.getCoordinates({
      street: 'bello akera',
      number: '5',
      city: 'lagos',
      state: 'lagos',
      postalCode: '100005',
    });
  }
}
