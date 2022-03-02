import { CountryCode } from '../constants';
import StoreProvider from './StoreProvider';

export enum ModeViewType {
  "LIST" = "LIST",
  "MAP" = "MAP"
}

export enum MapProvider {
  GOOGLE_MAP = 'GOOGLE_MAP',
  OPEN_STREETMAP = 'OPEN_STREETMAP'
}

export interface Modal {
  title: string;
  component: string;
  className?: string;
}

export type DistanceUnit = 'km' | 'mi';

export interface HclSDKConfigData {
  markerIcon?: string;
  markerIconCurrentLocation?: string;
  modeView?: ModeViewType;
  i18nBundlesPath?: string;
  modal?: Modal;
  entry?: any;
  icons: any;
  apiKey: string;
  appName?: string;
  appURL?: string;
  locale?: string;
  countryGeo?: string;
  countriesSubscriptionKey?: CountryCode[];
  distanceUnit?: DistanceUnit;
  distanceDefault?: number;
  showSuggestModification?: boolean;
  enableDarkMode?: boolean;
  enableMapDarkMode?: boolean;
  enableMedicalTerm?: boolean;
  disableCollectGeo?: boolean;
  stylesheet?: string;
  map: {
    provider: MapProvider;
    googleMapApiKey: string;
    googleMapId: string;
    enableLeafletAttribution?: boolean;
  },
  countryFilterSelected: CountryCode | '';
  enableHcoSearch?: boolean
}

export const initStateConfigStore: HclSDKConfigData = {
  apiKey: '',
  map: {
    provider: MapProvider.OPEN_STREETMAP,
    googleMapApiKey: '',
    googleMapId: '',
    enableLeafletAttribution: false
  },
  modeView: ModeViewType.LIST,
  modal: undefined,
  icons: {},
  appName: '',
  appURL: '',
  countryGeo: '', // From Geolocation
  countriesSubscriptionKey: [], // From Subscription Key
  distanceUnit: 'km',
  distanceDefault: 0,
  enableDarkMode: false,
  enableMapDarkMode: false,
  enableMedicalTerm: false,
  disableCollectGeo: false,
  showSuggestModification: true,
  countryFilterSelected: '',

  // hco search config
  enableHcoSearch: false
};

class ConfigStore extends StoreProvider<HclSDKConfigData> {

  get configGraphql() {
    return {
      headers: {
        'Ocp-Apim-Subscription-Key': this.state.apiKey
      }
    }
  }

  get countryGraphqlQuery() {
    const { countryGeo, countriesSubscriptionKey, countryFilterSelected } = this.state
    const countryGeoFormated = countryGeo.toUpperCase() as CountryCode

    if (countryFilterSelected) {
      return countryFilterSelected
    }

    if (countriesSubscriptionKey.includes(countryGeoFormated)) {
      return countryGeo.toUpperCase() as CountryCode
    }

    return countriesSubscriptionKey[0]
  }

}

export default ConfigStore;
