import StoreProvider from "./StoreProvider";
export interface AppConfigStyles {
  fontFamily?: string;
  fontColor?: string;
}
export interface OneKeySDKConfigData {
  appHeight?: string;
  appWidth?: string;
  mapTileLayer?: string;
  mapLink?: string;
  mapDefaultZoom?: number;
  markerIcon?: string;
  markerIconCurrentLocation?: string;
  styles?: AppConfigStyles | any;
}
export declare const initStateConfigStore: {
  appWidth: string;
  appHeight: string;
  styles: {
    fontFamily: string;
    color: string;
  };
  mapTileLayer: string;
  mapLink: string;
  mapDefaultZoom: number;
  markerIcon: string;
  markerIconCurrentLocation: string;
};
declare class ConfigStore extends StoreProvider<OneKeySDKConfigData> {
  constructor(state: OneKeySDKConfigData);
}
export default ConfigStore;
