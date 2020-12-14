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
}

export interface SearchMapState {
  loading?: boolean;
  specialties?: SpecialtyItem[];
  doctors?: HCPName[];
  search?: SearchResult;
  searchGeo?: any[];
  searchDoctor?: any[];
  currentLocation?: any;
  selectedValues?: SelectedValues;
  sortValues?: SortValue
  selectedIndividual?: SelectedIndividual
  individualDetail?: any;
}

export const initStateSearchMapStore: SearchMapState = {
  loading: false,
  specialties: [],
  search: {},
  searchGeo: [],
  searchDoctor: [],
  currentLocation: {},
  selectedValues: {},
  selectedIndividual: null,
  individualDetail: null,
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