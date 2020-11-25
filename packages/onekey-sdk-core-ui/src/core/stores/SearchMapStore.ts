import StoreProvider from "./StoreProvider";

export interface HCPItem {
  name: string,
  title?: string;
  address: string;
  createdAt: string;
  lat: number;
  lng: number;
}


export interface HCPName {
  id: string
  label: string
  gp: string
}

export interface SearchResult {
  selectedItem?: any;
  name?: string;
  address?: string;
}

export interface SearchMapState {
  loading?: boolean;
  hcpNearMe?: HCPItem[];
  doctors?: HCPName[];
  search?: SearchResult;
  searchGeo?: any[]
  currentLocation?: any;
}

export const initStateSearchMapStore: SearchMapState = {
  loading: false,
  hcpNearMe: [],
  search: {},
  searchGeo: [],
  currentLocation: {}
}

class SearchMapStore extends StoreProvider<SearchMapState> {
  constructor(state: SearchMapState) {
    super(state);
    this.state = state;
  }
}



export default SearchMapStore