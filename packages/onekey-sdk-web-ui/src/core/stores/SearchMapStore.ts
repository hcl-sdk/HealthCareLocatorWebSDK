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

export interface SelectedValues {
  name?: any;
  address?: any;
}

export interface SortValue {
  relevance?: boolean;
  distance?: boolean;
  name?: boolean;
}

export interface SearchMapState {
  loading?: boolean;
  hcpNearMe?: HCPItem[];
  doctors?: HCPName[];
  search?: SearchResult;
  searchGeo?: any[];
  searchDoctor?: any[];
  currentLocation?: any;
  selectedValues?: SelectedValues;
  sortValues?: SortValue
}

export const initStateSearchMapStore: SearchMapState = {
  loading: false,
  hcpNearMe: [],
  search: {},
  searchGeo: [],
  searchDoctor: [],
  currentLocation: {},
  selectedValues: {},
  sortValues: {
    relevance: false,
    distance: false,
    name: false
  }
}

class SearchMapStore extends StoreProvider<SearchMapState> {
  constructor(state: SearchMapState) {
    super(state);
    this.state = state;
  }
}



export default SearchMapStore