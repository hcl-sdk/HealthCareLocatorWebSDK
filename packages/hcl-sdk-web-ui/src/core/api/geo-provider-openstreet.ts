import axios from 'axios';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { i18nStore } from '../stores';
import { GeoProvider } from './geo-provider-interface';

export class GeoProviderOpenstreet implements GeoProvider {
  provider = new OpenStreetMapProvider({
    params: {
      'accept-language': i18nStore.state.lang,
    },
  });

  async searchGeoMap({ address, countrycodes }) {
    const results = await this.provider.search({
      query: {
        q: address,
        addressdetails: 1,
        countrycodes,
      },
    });

    const data = results.map(elm => ({
      name: elm.raw.display_name,
      lat: elm.raw.lat,
      lng: elm.raw.lon,
      addressDetails: elm.raw.address,
      boundingbox: elm.raw.boundingbox,
      type: 'location',
    }));

    return data;
  }

  async getAddressFromGeo(lat: number, lng: number) {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&osm_type=R&format=jsonv2`);
      const data = response.data;
      const { road, city, state_district, state, country } = data.address;

      data.shortDisplayName = [road, city, state_district, state, country].filter(str => !!str).join(', ');

      return data;
    } catch (err) {
      return null;
    }
  }
}
