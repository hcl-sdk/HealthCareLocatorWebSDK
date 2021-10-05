import { OKSDK_GEOLOCATION_HISTORY, storageUtils } from "../../utils/storageUtils";
import { NEAR_ME } from "../constants";
import StoreProvider from "./StoreProvider";

export type SearchInputName = 'name' | 'address' | 'medicalTerm' | 'specialtyName'

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
  medicalTerm: string;
  specialtyName: string;
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

export interface SearchTermItem {
  id: string;
  name: string; // longLbl
  lisCode: string;
}

export interface SearchSpecialty {
  id: string;
  name: string;
}

type SearchDoctor = SelectedIndividual

export interface SearchMapState {
  loading?: boolean;
  loadingActivitiesStatus?: 'idle' | 'success' | 'error' | 'loading' | 'unauthorized';
  loadingIndividualDetail?: boolean;
  loadingSwitchAddress?: boolean;
  specialties?: SpecialtyItem[];
  isAllowDisplayMapEmpty?: boolean;
  specialtiesRaw?: SpecialtyItem[];
  doctors?: HCPName[];
  search?: SearchResult;
  searchGeo?: any[];
  searchDoctor?: SearchDoctor[];
  searchSpecialty?: SearchSpecialty[];
  searchMedicalTerms: SearchTermItem[];
  selectedValues?: SelectedValues;
  sortValues?: SortValue
  selectedActivity?: SelectedIndividual
  individualDetail?: any;
  individualDetailName?: string;
  searchFields: SearchFields;
  locationFilter: any;
  specialtyFilter: SearchSpecialty[];
  medicalTermsFilter: SearchTermItem;
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
  isAllowDisplayMapEmpty: false,
  search: {},
  searchGeo: [],
  searchDoctor: [], // HCPs
  searchSpecialty: [],
  searchMedicalTerms: [],
  selectedValues: {},
  selectedActivity: null,
  individualDetail: null,
  sortValues: {
    distanceNumber: false,
    lastName: true
  },
  searchFields: {
    name: '', // First name or Last name of HCPs
    specialtyName: '',
    address: '',
    medicalTerm: ''
  },
  locationFilter: null,
  specialtyFilter: [],
  medicalTermsFilter: null,
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

  setSearchFieldValue(key: SearchInputName, value: string) {
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

  resetDataSearch({ 
    isResetHCPDetail = false,
    isResetSearchFields = false
  } = {}) {
    let resetHCPDetail = {}
    let resetSearchFields = {}

    if (isResetHCPDetail) {
      resetHCPDetail = {
        selectedActivity: null,
        individualDetail: null,
        specialties: [],
        specialtiesRaw: []
      }
    }

    if (isResetSearchFields) {
      resetSearchFields = {
        searchFields: {
          name: '',
          address: '',
          medicalTerm: '',
          specialtyName: '',
        },
        specialtyFilter: [],
        locationFilter: null,
        medicalTermsFilter: null
      }
    }

    this.setState({
      searchDoctor: [],
      searchGeo: [],
      searchSpecialty: [],
      searchMedicalTerms: [],
      ...resetSearchFields,
      ...resetHCPDetail
    })
  }

  get isGrantedGeoloc() {
    return this.state.geoLocation.status === 'granted';
  }

  get isSearchNearMe() {
    const { locationFilter, searchFields } = this.state
    const { name, specialtyName, medicalTerm, address  } = searchFields

    if (
      !name && !specialtyName && !medicalTerm && address &&
      locationFilter && locationFilter.id === NEAR_ME 
    ) {
      return true
    }

    return false
  }

  getSearchLabel(isRemovedAddr = false) {
    const searchFields = this.state.searchFields
    const { name, specialtyName, address, medicalTerm  } = searchFields

    const firstPart = [name, specialtyName, medicalTerm].filter(s => s).join(', ')
    const greyPart = address ? `<span class="address">${address.toLowerCase()}</span>` : ''

    if (isRemovedAddr) {
      return firstPart
    }

    return [
      firstPart ? `<span>${firstPart}</span>` : ''
      , greyPart].filter(s => s).join('')
  }
}



export default SearchMapStore
