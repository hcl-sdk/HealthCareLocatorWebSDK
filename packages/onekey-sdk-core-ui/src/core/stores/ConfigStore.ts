import StoreProvider from './StoreProvider';
import { getFullConfiguration, DEFAULT_CONFIGURATION, OnekeySDKConfig, OnekeySDKConfigInput } from 'onekey-sdk-core';
import { ViewportSize } from 'onekey-sdk-core-ui/src/components/ui-kits/onekey-sdk-viewport/types';
import { getContainerHeightWidthOffset } from 'onekey-sdk-core-ui/src/utils/helper';
export interface AppConfigStyles {
  fontFamily?: string;
  fontColor?: string;
}

export interface ViewSDKDimension {
  width: number;
  height: number;
}

export interface OneKeySDKConfigData {
  markerIcon?: string;
  markerIconCurrentLocation?: string;
  styles?: AppConfigStyles | any;
  input?: OnekeySDKConfig;
  viewPortSize?: ViewportSize;
  viewSDKDimension?: ViewSDKDimension;
}

export const initStateConfigStore = {
  styles: {
    fontFamily: '\'Roboto\', sans-serif',
    color: 'black'
  },
  // User input config
  input: DEFAULT_CONFIGURATION,
  viewPortSize: ViewportSize.Large,
  viewSDKDimension: {
    width: getContainerHeightWidthOffset().offsetWidth,
    height: getContainerHeightWidthOffset().offsetHeight,
  }
};

class ConfigStore extends StoreProvider<OneKeySDKConfigData> {
  constructor(state: OneKeySDKConfigData) {
    super(state);
    this.state = state;
  }

  public setInputConfig(inputConfig: OnekeySDKConfigInput) {
    this.setState({
      ...this.state,
      input: getFullConfiguration(inputConfig),
    })
  }
}

export default ConfigStore;
