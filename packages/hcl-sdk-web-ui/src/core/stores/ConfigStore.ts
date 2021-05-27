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
  countries?: string[];
  showSuggestModification?: boolean;
  mapProvider: MapProvider;
  googleMapApiKey: string;
  googleMapId: string;
}

export const initStateConfigStore = {
  mapProvider: MapProvider.OPEN_STREETMAP,
  apiKey: '',
  googleMapApiKey: '',
  googleMapId: '',
  modeView: ModeViewType.LIST,
  modal: undefined,
  icons: {},
  appName: '',
  appURL: '',
  countries: [],
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

}

export default ConfigStore;
