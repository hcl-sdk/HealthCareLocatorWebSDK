import { loadGoogleMapApi } from '../google-api-loader';
import { GeoProvider, IAddressFromGeo, IGeoMapSearchResult } from './geo-provider-interface';

export class GeoProviderGoogle implements GeoProvider {
  geocoder: google.maps.Geocoder | undefined;
  options: any;

  constructor(options) {
    this.options = options;
  }

  private async createGeocoder() {
    if (!this.geocoder) {
      await loadGoogleMapApi(this.options);
      this.geocoder = new google.maps.Geocoder();
    }
  }

  async searchGeoMap({ address, countrycodes }): Promise<IGeoMapSearchResult[]> {
    await this.createGeocoder();

    // TODO: Google can only restrict for one country
    return new Promise(resolve => {
      const request = { address } as any;
      const countryCodes = countrycodes.split(',')
      const country = countryCodes[0] ? countryCodes[0].toUpperCase() : null
      if (country) {
        request.componentRestrictions = {
          country
        }
      }
      this.geocoder.geocode(
        request,
        (results, status) => {
          if (status === 'OK') {
            const geoData = results.map(item => ({
              name: item.formatted_address,
              lat: item.geometry.location.lat(),
              lng: item.geometry.location.lng(),
              addressDetails: {
                city: getCity(item),
                state: getState(item),
                country_code: getCountryCode(item),
                country: getCountry(item),
              },
              boundingbox: getBoundingBox(item),
              type: 'location',
            }));

            return resolve(geoData);
          } else {
            return resolve([]);
          }
        },
      );
    });
  }

  async getAddressFromGeo(lat: number, lng: number): Promise<IAddressFromGeo | null> {
    await this.createGeocoder();

    return new Promise(resolve => {
      this.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK') {
          const addressData = {
            address: {
              country_code: getCountryCode(results[0]),
            },
            boundingbox: getBoundingBox(results[0]),
            addressDetails: {
              city: getCity(results[0]),
              state: getState(results[0]),
              country_code: getCountryCode(results[0]),
              country: getCountry(results[0]),
            },
            shortDisplayName: results[0].formatted_address,
          };

          return resolve(addressData);
        } else {
          return resolve(null);
        }
      });
    });
  }
}

const getCity = (item: google.maps.GeocoderResult) => {
  return item.address_components.find(component => component.types.includes('locality'))?.long_name;
};

function getState(item: google.maps.GeocoderResult): any {
  return item.address_components.find(component => component.types.includes('administrative_area_level_1'))?.long_name;
}

function getCountryCode(item: google.maps.GeocoderResult): any {
  return item.address_components.find(component => component.types.includes('country'))?.short_name;
}

function getBoundingBox(item: google.maps.GeocoderResult) {
  const sw = item.geometry.bounds?.getSouthWest();
  const ne = item.geometry.bounds?.getNorthEast();
  return [`${sw?.lat()}`, `${ne?.lat()}`, `${sw?.lng()}`, `${ne?.lng()}`];
}

function getCountry(item: google.maps.GeocoderResult) {
  return item.address_components.find(component => component.types.includes('country'))?.long_name;
}
