import { Disease, Review } from "../../../../hcl-sdk-core/src/graphql/types";
import { OKSDK_GEOLOCATION_HISTORY, storageUtils } from "../../utils/storageUtils";
import { NEAR_ME } from "../constants";
import StoreProvider from "./StoreProvider";

export type SearchInputName = 'name' | 'address' | 'medicalTerm' | 'specialtyName' | 'country' | 'search-target'

export interface SpecialtyItem {
  name: string;
  distance?: string;
  distanceNumber?: number;
  specialties?: string;
  title?: string;
  address?: string;
  createdAt?: string;
  specialtyPrimary?: string;
  lat?: number;
  lng?: number;
  id: string;
  reviewsAvailable?: boolean
  diseasesAvailable?: boolean
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

type SORT_DISABLED = 'SORT_DISABLED';

export interface SortValue {
  distanceNumber?: boolean | SORT_DISABLED;
  lastName?: boolean;
  relevance?: boolean;
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
  isHighlighted?: boolean
}

type SearchDoctor = SelectedIndividual

export type IndividualDetail = {
  id: string
  individualId: string
  name: string
  firstName: string
  lastName: string
  middleName: string
  professionalType: string
  specialties: SearchSpecialty[]
  listTerms: string[]
  addressName: string
  addressBuildingName: string
  address: string
  postalCode: string
  city: string
  country: string
  webAddress: string
  phone?: string
  fax?: string
  lat: number
  lng: number
  activitiesList: any[]
  uciAdeli?: string
  uciRpps?: string
  reviewsAvailable?: boolean
  diseasesAvailable?: boolean
  reviewsByIndividual?: {
    diseases: Disease[]
    reviews: Review[]
    idnat: string
  }
  url?: string
  openHours?: {
    day?: string
    openPeriods?: {
      open?: string
      close?: string
    }
  }[]
}

type HCOCore = {
  id: string
  name: string
  type: string
  address: string
  phone: string
  website: string
  fax: string
  lat: number
  lng: number
  individuals: {
    service?: string
    subService?: string
    name: string
    specialty: string
    isShowRecommendation: boolean
    url: string
    mainActivity: {
      id: string
    }
  }[]
  uci?: string
}

type HCO = HCOCore & {
  children?: (HCOCore & {
    children?: (HCOCore & {
      children?: HCOCore[]
    })[]
  })[]
}

export enum SEARCH_TARGET {
  HCO = 'HCO',
  HCP = 'HCP'
}

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
  individualDetail?: IndividualDetail;
  individualDetailName?: string;
  searchFields: SearchFields;
  locationFilter: any;
  specialtyFilter: SearchSpecialty[];
  medicalTermsFilter: SearchTermItem;
  geoLocation?: GeoLocation;
  navigatedFromHome?: boolean;
  cachedActivities?: Record<string, any[]>
  // hco
  searchTarget: SEARCH_TARGET,
  hcos?: {
    id: string
    name: string
    address: string
    distance: string
    distanceNumber: number
    lat: number
    lng: number
  }[];
  selectedHco?: {
    id: string
    name: string
    address: string
    distance: string
    distanceNumber: number
    lat: number
    lng: number
  },
  hcoDetail: HCO
  loadingHcoDetail?: 'idle' | 'success' | 'error' | 'loading' | 'unauthorized'; 
  loadingHcosStatus?: 'idle' | 'success' | 'error' | 'loading' | 'unauthorized';
  navigateFromHcoFullCard?: boolean,
  searchHcos: {
    name?: string;
    specialty?: string;
    address?: string;
  }[]
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
    lastName: false,
    relevance: true
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
  navigatedFromHome: false,
  cachedActivities: {},

  // hco
  searchTarget: SEARCH_TARGET.HCP,
  selectedHco: null,
  hcoDetail: null,
  hcos: null,
  loadingHcosStatus: 'idle',
  navigateFromHcoFullCard: false,
  searchHcos: []
}

class SearchMapStore extends StoreProvider<SearchMapState> {
  constructor(state: SearchMapState) {
    super(state);
    this.state = state;
  }

  setSearchTarget(searchTarget: SEARCH_TARGET) {
    this.setState({
      searchTarget
    })
  }

  get searchTarget() {
    return this.state.searchTarget
  }

  setSortValues(sortValue: SortValue) {
    this.setState({
      sortValues: {
        ...this.state.sortValues,
        ...sortValue,
        distanceNumber: this.isGrantedGeoloc ? sortValue.distanceNumber : 'SORT_DISABLED',
      },
    });
  }

  get sortValues() {
    return {
      ...this.state.sortValues,
      distanceNumber: this.isGrantedGeoloc ? this.state.sortValues.distanceNumber : 'SORT_DISABLED',
    };
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
    isResetSearchFields = false,
    isResetHCODetail = false
  } = {}) {
    let resetHCPDetail = {}
    let resetSearchFields = {}
    let resetHCODetail = {}

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

    if (isResetHCODetail) {
      resetHCODetail = {
        selectedActivity: null,
        individualDetail: null,
        specialties: [],
        specialtiesRaw: []
      }
    }

    this.setState({
      searchDoctor: [],
      searchGeo: [],
      searchSpecialty: [],
      searchMedicalTerms: [],
      searchHcos: [],
      ...resetSearchFields,
      ...resetHCPDetail,
      ...resetHCODetail
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

  getCached(storeKey: string) {
    if (storeKey && this.state.cachedActivities[storeKey]) {
      return this.state.cachedActivities[storeKey]
    }
    return null
  }

  saveCached(storeKey: string, activities: any[]) {
    if (storeKey && activities) {
      this.state.cachedActivities[storeKey] = activities
    }
  }

  get activities() {
    return {
      isLoading: this.state.loadingActivitiesStatus === 'loading',
      status: this.state.loadingActivitiesStatus,
      data: this.state.specialties
    }
  }

  setActivitiesLoadingStatus(status: 'loading' | 'idle' | 'success' | 'error' | 'unauthorized') {
    this.setState({
      loadingActivitiesStatus: status,
    });
  }
}



export default SearchMapStore
