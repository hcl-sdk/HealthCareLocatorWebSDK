import StoreProvider from "./StoreProvider";
export const initStateSearchMapStore = {
  hcpNearMe: [],
  search: {}
};
class SearchMapStore extends StoreProvider {
  constructor(state) {
    super(state);
    this.state = state;
  }
}
export default SearchMapStore;
