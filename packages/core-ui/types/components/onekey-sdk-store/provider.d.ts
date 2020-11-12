export interface AppStyles {
  fontFamily: string;
}
export interface OneKeySDKConfigData {
  appHeight?: string;
  appWidth?: string;
  mapTileLayer?: string;
  mapLink?: string;
  markerIcon?: string;
  markerIconCurrentLocation?: string;
  styles?: AppStyles | any;
}
export interface HCPItem {
  name: string;
  title?: string;
  address: string;
  createdAt: string;
  lat: number;
  lng: number;
}
export interface Search {
  selectedItem: any;
  name: string;
  address: string;
}
export interface StoreProps {
  config?: OneKeySDKConfigData;
  hcpNearMe?: HCPItem[];
  hcpLastSearch?: HCPItem[];
  hcpConsulted?: HCPItem[];
  search?: Search;
}
export declare type SetStore = (a: StoreProps) => void;
export interface State {
  store: StoreProps;
  setStore?: SetStore;
}
export declare const initState: {
  store: {
    config: {};
    hcpNearMe: any[];
    hcpLastSearch: any[];
    hcpConsulted: any[];
  };
};
export declare const Store: {
  Provider: import("@stencil/state-tunnel/dist/types/stencil.core").FunctionalComponent<{
    state: State;
  }>;
  Consumer: import("@stencil/state-tunnel/dist/types/stencil.core").FunctionalComponent<{}>;
  injectProps: (Cstr: any, fieldList: import("@stencil/state-tunnel/dist/types/declarations").PropList<State>) => void;
};
