import { configStore, searchMapStore } from '../stores';
import { MapProvider } from '../stores/ConfigStore';
import { GeoProviderGoogle } from './geo-provider-google';
import { GeoProviderOpenstreet } from './geo-provider-openstreet';

export async function searchGeoMap({ id }) {
  searchMapStore.setState({ loading: true, searchGeo: [], searchDoctor: [] });

  const provider =
    configStore.state.map.provider === MapProvider.OPEN_STREETMAP
      ? new GeoProviderOpenstreet()
      : new GeoProviderGoogle({
          googleMapApiKey: configStore.state.map.googleMapApiKey,
        });

  const results = await provider.searchGeoMap({
    address: id,
    countrycodes: configStore.state.countries.join(','),
  });

  searchMapStore.setState({
    searchGeo: results,
    loading: false,
  });
}

export async function getAddressFromGeo(lat: number, lng: number) {
  const provider =
    configStore.state.map.provider === MapProvider.OPEN_STREETMAP
      ? new GeoProviderOpenstreet()
      : new GeoProviderGoogle({
          googleMapApiKey: configStore.state.map.googleMapApiKey,
        });

  try {
    const data = provider.getAddressFromGeo(lat, lng);

    return data;
  } catch (err) {
    return null;
  }
}
