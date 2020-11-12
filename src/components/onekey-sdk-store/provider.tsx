import { h } from '@stencil/core'
import { createProviderConsumer } from "@stencil/state-tunnel";

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
  name: string,
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
  hcpNearMe?: HCPItem[],
  hcpLastSearch?: HCPItem[],
  hcpConsulted?: HCPItem[],
  search?: Search
}

export type SetStore = (a: StoreProps) => void

export interface State {
  store: StoreProps,
  setStore?: SetStore
}

export const initState = {
  store: {
    config: {},
    hcpNearMe: [],
    hcpLastSearch: [],
    hcpConsulted: []
  }
}

export const Store = createProviderConsumer<State>(initState, (subscribe, child) => <context-consumer subscribe={subscribe} renderer={child} />)
