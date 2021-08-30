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
  countries?: string[];
  countriesSubscriptionKey?: string[];
  showSuggestModification?: boolean;
  enableMedicalTerm?: Boolean;
  map: {
    provider: MapProvider;
    googleMapApiKey: string;
    googleMapId: string;
  }
}

export const initStateConfigStore = {
  apiKey: '',
  map: {
    provider: MapProvider.OPEN_STREETMAP,
    googleMapApiKey: '',
    googleMapId: '',
  },
  modeView: ModeViewType.LIST,
  modal: undefined,
  icons: {},
  appName: '',
  appURL: '',
  countryGeo: '', // From Geolocation
  countries: [], // From Config
  countriesSubscriptionKey: [], // From Subscription Key
  enableMedicalTerm: false,
  showSuggestModification: true
};

class ConfigStore extends StoreProvider<HclSDKConfigData> {

  get configGraphql() {
    return {
      headers: {
        'Ocp-Apim-Subscription-Key': this.state.apiKey
      }
    }
  }

  get activitiesCountry() {
    const { countryGeo, countriesSubscriptionKey } = this.state

    if (countriesSubscriptionKey.length === 1) {
      return countriesSubscriptionKey[0]
    }
    if (countriesSubscriptionKey.includes(countryGeo.toLowerCase())) {
      return countryGeo.toLowerCase()
    }

    return countriesSubscriptionKey[0]
  }

}

export default ConfigStore;
