import { configStore, searchMapStore } from '../stores';
import { MapProvider } from '../stores/ConfigStore';
import { GeoProviderGoogle } from './geo-provider-google';
import { GeoProviderOpenstreet } from './geo-provider-openstreet';

export async function searchGeoMap({ id }) {
  searchMapStore.setState({ loading: true, searchGeo: [], searchDoctor: [] });
  const provider = getProvider(configStore.state.map.provider);

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
  const provider = getProvider(configStore.state.map.provider);
  try {
    const data = provider.getAddressFromGeo(lat, lng);

    return data;
  } catch (err) {
    return null;
  }
}

export async function getGooglePlaceDetails(placeId: string) {
  const googleGeo = getProvider(MapProvider.GOOGLE_MAP) as GeoProviderGoogle;
  return await googleGeo.getPlaceDetail(placeId);
}

function getProvider(providerName: MapProvider) {
  return providerName === MapProvider.OPEN_STREETMAP
    ? new GeoProviderOpenstreet()
    : new GeoProviderGoogle({
        googleMapApiKey: configStore.state.map.googleMapApiKey,
      });
}
