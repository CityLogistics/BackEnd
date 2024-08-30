import { Controller, Get } from '@nestjs/common';
import { MapService } from './map.service';

@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get()
  async address() {
    return await this.mapService.getDistance(
      { lat: 50.454722, lng: -104.606667 },
      { lat: 51.454722, lng: -104.606667 },
    );
  }
}
