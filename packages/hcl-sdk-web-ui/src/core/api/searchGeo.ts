import axios from 'axios';
// import { id } from 'date-fns/locale';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { searchMapStore } from '../stores';

export async function searchGeoMap({ id }) {
  searchMapStore.setState({ loading: true, searchGeo: [], searchDoctor: [] })
  const provider = new OpenStreetMapProvider();

  const results = await provider.search({ query: id });

  const data = results.map(elm => ({
    name: elm.raw.display_name,
    lat: elm.raw.lat,
    lng: elm.raw.lon,
    type: "location"
  }))

  searchMapStore.setState({
    searchGeo: data,
    loading: false
  })
}

export async function getAddressFromGeo(lat: number, lng: number) {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&osm_type=R&format=jsonv2`);
    const data = response.data;
    const { road, city, state_district, state, country } = data.address;

    data.shortDisplayName = [road, city, state_district, state, country].join(', ');

    return data;
  } catch(err) {
    return null;
  }
}
