import StoreProvider from "./StoreProvider";

export interface SpecialtyItem {
  name: string;
  distance?: string;
  specialties?: string;
  title?: string;
  address?: string;
  createdAt?: string;
  lat?: number;
  lng?: number;
}

export interface SearchFields {
  name: string;
  address: string;
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

export interface SelectedIndividual {
  name?: string;
  specialty?: string;
  address?: string;
  id?: string
  individualId?: string;
}

export interface SearchMapState {
  loading?: boolean;
  specialties?: SpecialtyItem[];
  specialtiesRaw?: SpecialtyItem[];
  doctors?: HCPName[];
  search?: SearchResult;
  searchGeo?: any[];
  searchDoctor?: any[];
  currentLocation?: any;
  selectedValues?: SelectedValues;
  sortValues?: SortValue
  selectedActivity?: SelectedIndividual
  individualDetail?: any;
  searchFields: SearchFields;
  locationFilter: any;
  specialtyFilter: any;
}

export const initStateSearchMapStore: SearchMapState = {
  loading: false,
  specialties: [],
  specialtiesRaw: [],
  search: {},
  searchGeo: [],
  searchDoctor: [],
  currentLocation: {},
  selectedValues: {},
  selectedActivity: null,
  individualDetail: null,
  sortValues: {
    relevance: false,
    distance: false,
    name: false
  },
  searchFields: {
    name: '',
    address: ''
  },
  locationFilter: null,
  specialtyFilter: null
}

class SearchMapStore extends StoreProvider<SearchMapState> {
  constructor(state: SearchMapState) {
    super(state);
    this.state = state;
  }

  setSearchFieldValue(key: string, value: string) {
    this.setState({
      searchFields: {
        ...this.state.searchFields,
        [key]: value
      }
    })
  }
}



export default SearchMapStore
