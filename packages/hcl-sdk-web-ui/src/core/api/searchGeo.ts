import { configStore, searchMapStore } from '../stores';
import { MapProvider } from '../stores/ConfigStore';
import { GeoProviderGoogle } from './geo-provider-google';
import { GeoProviderOpenstreet } from './geo-provider-openstreet';

export async function searchGeoMap({ id }) {
  searchMapStore.setState({ 
    loading: true, 
    searchGeo: [],
    isResultSearchGeo: {
      ...searchMapStore.state.isResultSearchGeo,
      [id]: true
    }
  });
  const provider = getProvider(configStore.state.map.provider);

  const geoCountry = configStore.countryGraphqlQuery
  let countryCode = geoCountry.toLowerCase()

  if (geoCountry === 'UK') {
    countryCode = 'gb'
  }

  if (geoCountry === 'BK') {
    countryCode = 'hr'
  }

  const countrycodes = [ countryCode ]

  const results = await provider.searchGeoMap({
    address: id,
    countrycodes
  });

  searchMapStore.setState({
    searchGeo: results,
    loading: false,
    isResultSearchGeo: {
      ...searchMapStore.state.isResultSearchGeo,
      [id]: results?.length > 0
    }
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

const cachePlaceDetails = new Map();
const CACHE_SIZE = 5;

export async function getGooglePlaceDetails(placeId: string) {
  const googleGeo = getProvider(MapProvider.GOOGLE_MAP) as GeoProviderGoogle;

  if (!cachePlaceDetails.has(placeId)) {
    const placeDetail = await googleGeo.getPlaceDetail(placeId);
    cachePlaceDetails.set(placeId, placeDetail);
  }

  const result = cachePlaceDetails.get(placeId);

  if (cachePlaceDetails.size > CACHE_SIZE) {
    cachePlaceDetails.clear();
  }

  return result;
}

function getProvider(providerName: MapProvider) {
  return providerName === MapProvider.OPEN_STREETMAP
    ? new GeoProviderOpenstreet()
    : new GeoProviderGoogle({
        googleMapApiKey: configStore.state.map.googleMapApiKey,
      });
}
