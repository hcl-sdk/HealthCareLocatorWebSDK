import StoreProvider from "./StoreProvider";
export interface HCPItem {
  name: string;
  title?: string;
  address: string;
  createdAt: string;
  lat: number;
  lng: number;
}
export interface SearchResult {
  selectedItem?: any;
  name?: string;
  address?: string;
}
export interface SearchMapState {
  loading?: boolean;
  hcpNearMe?: HCPItem[];
  search?: SearchResult;
  searchGeo?: any[];
}
export declare const initStateSearchMapStore: SearchMapState;
declare class SearchMapStore extends StoreProvider<SearchMapState> {
  constructor(state: SearchMapState);
}
export default SearchMapStore;
