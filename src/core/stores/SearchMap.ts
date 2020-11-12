import StoreProvider from "./StoreProvider";

export interface HCPItem {
  name: string,
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
  hcpNearMe?: HCPItem[],
  search?: SearchResult
}

export const initStateSearchMapStore: SearchMapState = {
  hcpNearMe: [],
  search: {}
}

class SearchMapStore extends StoreProvider<SearchMapState> {
  constructor(state: SearchMapState) {
    super(state);
    this.state = state;
  }
}



export default SearchMapStore