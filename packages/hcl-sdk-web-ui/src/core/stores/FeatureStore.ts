import StoreProvider from './StoreProvider';

interface FeatureStoreState {
  hcoSearch: boolean;
}

const initialState = {
  hcoSearch: true,
};

export default class FeatureStore extends StoreProvider<FeatureStoreState> {
  constructor() {
    super(initialState);
  }

  get isHcoSearchEnabled() {
    return this.state.hcoSearch;
  }
}
