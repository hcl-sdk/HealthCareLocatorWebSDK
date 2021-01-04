import StoreProvider from './StoreProvider';

interface I18nStoreState {
  labels: {
    [k: string]: string;
  }
}

const initialState = {
  labels: {}
}

export default class UIStore extends StoreProvider<I18nStoreState> {
  constructor() {
    super(initialState);
  }

  translate(key: string) {
    if (!this.state.labels[key]) {
      console.log(`[i18n] missing transation for "${key}"`);
      return key;
    }
    return this.state.labels[key];
  }
}
