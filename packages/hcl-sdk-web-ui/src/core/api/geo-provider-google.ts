import { loadGoogleMapApi } from '../google-api-loader';
import { GeoProvider, IAddressFromGeo, IGeoMapSearchResult } from './geo-provider-interface';

export class GeoProviderGoogle implements GeoProvider {
  geocoder: google.maps.Geocoder | undefined;
  places: google.maps.places.PlacesService | undefined;
  autocomplete: google.maps.places.AutocompleteService | undefined;
  _map: google.maps.Map;
  options: any;

  constructor(options) {
    this.options = options;
  }

  private async initGoogleService() {
    if (!this.geocoder) {
      await loadGoogleMapApi(this.options);
      this.geocoder = new google.maps.Geocoder();

      const mapDiv = document.createElement('div');
      mapDiv.style.display = 'none';
      document.body.appendChild(mapDiv);
      this._map = new google.maps.Map(mapDiv);
      this.places = new google.maps.places.PlacesService(this._map);
      this.autocomplete = new google.maps.places.AutocompleteService();
    }
  }

  async searchGeoMap({ address, countrycodes }): Promise<IGeoMapSearchResult[]> {
    await this.initGoogleService();

    return await new Promise(resolve => {
      this.autocomplete.getPlacePredictions(
        {
          input: address,
          componentRestrictions: {
            country: countrycodes.split(','),
          },
        },
        (predictions, status) => {
          if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
            return resolve([]);
          }
          const geoData = predictions.map(item => ({
            name: item.description,
            place_id: item.place_id,
            type: 'location',
          }));

          return resolve(geoData);
        },
      );
    });
  }

  async getAddressFromGeo(lat: number, lng: number): Promise<IAddressFromGeo | null> {
    await this.initGoogleService();

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

  async getPlaceDetail(placeId): Promise<{
    name: string;
    lat: number;
    lng: number;
    addressDetails: {
      city?: string;
      state?: string;
      country_code?: string;
      country?: string;
      road?: string;
    };
    boundingbox: string[];
  }> {
    await this.initGoogleService();

    return new Promise(resolve => {
      this.places.getDetails({ placeId }, (result, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          return resolve({
            name: result.formatted_address,
            addressDetails: {
              road: getRoad(result),
              city: getCity(result),
              state: getState(result),
              country_code: getCountryCode(result),
              country: getCountryCode(result),
            },
            lat: result.geometry.location?.lat(),
            lng: result.geometry.location?.lng(),
            boundingbox: getBoundingBoxFromPlaceResult(result),
          });
        }

        return resolve(null);
      });
    });
  }
}

const getRoad = (item: google.maps.GeocoderResult | google.maps.places.PlaceResult) => {
  return item.address_components?.find(component => component.types.includes('route'))?.long_name;
};

const getCity = (item: google.maps.GeocoderResult | google.maps.places.PlaceResult) => {
  return item.address_components?.find(component => component.types.includes('locality'))?.long_name;
};

function getState(item: google.maps.GeocoderResult | google.maps.places.PlaceResult): any {
  return item.address_components?.find(component => component.types.includes('administrative_area_level_1'))?.long_name;
}

function getCountryCode(item: google.maps.GeocoderResult | google.maps.places.PlaceResult): any {
  return item.address_components?.find(component => component.types.includes('country'))?.short_name;
}

function getBoundingBox(item: google.maps.GeocoderResult) {
  const sw = item.geometry.bounds?.getSouthWest() || item.geometry.viewport?.getSouthWest();
  const ne = item.geometry.bounds?.getNorthEast() || item.geometry.viewport?.getSouthWest();
  return [`${sw?.lat()}`, `${ne?.lat()}`, `${sw?.lng()}`, `${ne?.lng()}`];
}

function getBoundingBoxFromPlaceResult(item: google.maps.places.PlaceResult) {
  const sw = item.geometry.viewport?.getSouthWest();
  const ne = item.geometry.viewport?.getNorthEast();
  return [`${sw?.lat()}`, `${ne?.lat()}`, `${sw?.lng()}`, `${ne?.lng()}`];
}

function getCountry(item: google.maps.GeocoderResult | google.maps.places.PlaceResult) {
  return item.address_components?.find(component => component.types.includes('country'))?.long_name;
}
