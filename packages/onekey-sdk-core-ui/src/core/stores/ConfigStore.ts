import StoreProvider from './StoreProvider';
import { getFullConfiguration, DEFAULT_CONFIGURATION, OnekeySDKConfig, OnekeySDKConfigInput } from 'onekey-sdk-core';

export interface AppConfigStyles {
  fontFamily?: string;
  fontColor?: string;
}

export interface OneKeySDKConfigData {
  markerIcon?: string;
  markerIconCurrentLocation?: string;
  styles?: AppConfigStyles | any;
  input: OnekeySDKConfig;
}

export const initStateConfigStore = {
  styles: {
    fontFamily: '\'Roboto\', sans-serif',
    color: 'black'
  },
  // User input config
  input: DEFAULT_CONFIGURATION,
};

class ConfigStore extends StoreProvider<OneKeySDKConfigData> {
  constructor(state: OneKeySDKConfigData) {
    super(state);
    this.state = state;
  }

  public setInputConfig(inputConfig: OnekeySDKConfigInput) {
    this.state = {
      ...this.state,
      input: getFullConfiguration(inputConfig),
    };
  }
}

export default ConfigStore;
