import { OKSDK_GEOLOCATION_HISTORY, storageUtils } from "../../utils/storageUtils";
import StoreProvider from "./StoreProvider";

export interface SpecialtyItem {
  name: string;
  distance?: string;
  distanceNumber?: number;
  specialties?: string;
  title?: string;
  address?: string;
  createdAt?: string;
  lat?: number;
  lng?: number;
  id: string;
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
  distanceNumber?: boolean;
  lastName?: boolean;
}

export interface SelectedIndividual {
  name?: string;
  specialty?: string;
  address?: string;
  id?: string
  individualId?: string;
  lat?: number;
  lng?: number;
}

export interface SearchMapState {
  loading?: boolean;
  loadingActivitiesStatus?: 'idle' | 'success' | 'error' | 'loading';
  loadingIndividualDetail?: boolean;
  loadingSwitchAddress?: boolean;
  specialties?: SpecialtyItem[];
  specialtiesRaw?: SpecialtyItem[];
  doctors?: HCPName[];
  search?: SearchResult;
  searchGeo?: any[];
  searchDoctor?: any[];
  selectedValues?: SelectedValues;
  sortValues?: SortValue
  selectedActivity?: SelectedIndividual
  individualDetail?: any;
  individualDetailName?: string;
  searchFields: SearchFields;
  locationFilter: any;
  specialtyFilter: any;
  geoLocation?: GeoLocation;
  navigatedFromHome?: boolean;
}

export type GeoLocationStatus = 'granted' | 'denied';
export interface GeoLocation {
  status: GeoLocationStatus,
  latitude: number;
  longitude: number;
}

export const initStateSearchMapStore: SearchMapState = {
  loading: false,
  loadingActivitiesStatus: 'idle',
  loadingIndividualDetail: false,
  loadingSwitchAddress: false,
  specialties: [],
  specialtiesRaw: [],
  search: {},
  searchGeo: [],
  searchDoctor: [],
  selectedValues: {},
  selectedActivity: null,
  individualDetail: null,
  sortValues: {
    relevance: true, // Default sort by relevance
    distanceNumber: false,
    lastName: false
  },
  searchFields: {
    name: '',
    address: ''
  },
  locationFilter: null,
  specialtyFilter: null,
  geoLocation: {
    status: 'denied' as GeoLocationStatus,
    latitude: 0,
    longitude: 0
  },
  navigatedFromHome: false
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

  setGeoLocation({ 
    latitude = 0,
    longitude = 0,
  } = {}) {

    this.setState({
      geoLocation: {
        ...this.state.geoLocation,
        status: 'granted',
        latitude,
        longitude
      }
    })
    
    storageUtils.setObject(OKSDK_GEOLOCATION_HISTORY, {
      latitude,
      longitude,
      time: Date.now()
    })
  }

  getGeoLocation(shorthand: boolean = false) {
    const { latitude, longitude } = this.state.geoLocation;

    if (shorthand) {
      return { 
        lat: latitude, 
        lng: longitude 
      };
    }

    return {
      latitude, 
      longitude
    }
  }

  get isGrantedGeoloc() {
    return this.state.geoLocation.status === 'granted';
  }
}



export default SearchMapStore
