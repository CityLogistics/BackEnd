import {
  Client,
  TravelMode,
  UnitSystem,
} from '@googlemaps/google-maps-services-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MapService extends Client {
  private readonly accessKey = this.config.get('GOOGLE_MAPS_ACCESS_KEY');

  constructor(private config: ConfigService) {
    super();
  }

  async getCoordinates(address: {
    street: string;
    number: string;
    city: string;
    state: string;
    postalCode: string;
  }): Promise<any> {
    const googleRes = await this.geocode({
      params: {
        address: `${address.street}, ${address.number}, ${address.city}, ${address.state}, ${address.postalCode}`,
        key: this.accessKey,
        region: 'ng',
        place_id:
          'EjBJZG93dSBBa2VyYSBTdHJlZXQsIElmYWtvLUlqYWl5ZSwgTGFnb3MsIE5pZ2VyaWEiLiosChQKEgn_GBPhDpc7EBGE9fimuRVK1hIUChIJZTh79OOWOxARKbK6gyZtI5U',
      },
    });

    const googleRes2 = await this.distancematrix({
      params: {
        origins: ['idowu akera ,ijaiye'],
        destinations: ['ikeja city mall'],
        mode: TravelMode.driving,
        units: UnitSystem.metric,
        key: this.accessKey,
      },
    });
    const googleRes3 = await this.placeQueryAutocomplete({
      params: { input: 'idowu akera ,ijaiye', key: this.accessKey },
    });

    const data = googleRes.data.results[0].geometry;
    return { data, d: googleRes2.data, m: googleRes3.data };
  }
}
