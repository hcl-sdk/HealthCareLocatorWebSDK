import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { searchMapStore } from '../stores';

async function searchGeoMap(value: string) {
  searchMapStore.setState({ loading: true })
  const provider = new OpenStreetMapProvider();

  const results = await provider.search({ query: value });

  searchMapStore.setState({
    searchGeo: results,
    loading: false
  })
}

export default searchGeoMap