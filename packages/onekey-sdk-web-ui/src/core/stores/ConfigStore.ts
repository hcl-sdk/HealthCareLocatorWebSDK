import StoreProvider from './StoreProvider';
import { DEFAULT_CONFIGURATION, OnekeySDKConfig } from 'onekey-sdk-core';
import { ViewportSize } from 'onekey-sdk-web-ui/src/components/ui-kits/onekey-sdk-viewport/types';
import { getContainerHeightWidthOffset } from 'onekey-sdk-web-ui/src/utils/helper';
export interface AppConfigStyles {
  fontFamily?: string;
  fontColor?: string;
}

export interface ViewSDKDimension {
  width: number;
  height: number;
}

export enum ModeViewType {
  "LIST" = "LIST",
  "MAP" = "MAP"
}

export interface Modal {
  title: string;
  component: string
}

export interface OneKeySDKConfigData {
  markerIcon?: string;
  markerIconCurrentLocation?: string;
  styles?: AppConfigStyles | any;
  input?: OnekeySDKConfig;
  viewPortSize?: ViewportSize;
  viewSDKDimension?: ViewSDKDimension;
  modeView?: ModeViewType;
  homeMode?: 'full' | 'min';
  modal?: Modal;
}

export const initStateConfigStore = {
  // User input config
  input: DEFAULT_CONFIGURATION,
  viewPortSize: ViewportSize.Large,
  viewSDKDimension: {
    width: getContainerHeightWidthOffset().offsetWidth,
    height: getContainerHeightWidthOffset().offsetHeight,
  },
  modeView: ModeViewType.LIST,
  modal: undefined
};

class ConfigStore extends StoreProvider<OneKeySDKConfigData> {}

export default ConfigStore;
