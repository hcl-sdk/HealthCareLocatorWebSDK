import axios from 'axios';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { searchMapStore } from '../stores';

export async function searchGeoMap(value: string) {
  searchMapStore.setState({ loading: true })
  const provider = new OpenStreetMapProvider();

  const results = await provider.search({ query: value });

  searchMapStore.setState({
    searchGeo: results,
    loading: false
  })
}

export async function getAddressFromGeo(lat, lng) {
  const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&osm_type=R&format=jsonv2`);
  searchMapStore.setState({
    currentLocation: res.data
  })
}
