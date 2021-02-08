import StoreProvider from './StoreProvider';

export enum ModeViewType {
  "LIST" = "LIST",
  "MAP" = "MAP"
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
  appShowSuggestModification?: boolean;
}

export const initStateConfigStore = {
  apiKey: '',
  modeView: ModeViewType.LIST,
  modal: undefined,
  icons: {},
  appName: '',
  appURL: '',
  appShowSuggestModification: true
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
