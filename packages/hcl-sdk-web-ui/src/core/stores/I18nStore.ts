import StoreProvider from './StoreProvider';

interface I18nStoreState {
  labels: {
    [k: string]: string;
  },
  lang: string;
}

const initialState = {
  labels: {},
  lang: 'en'
}

export default class UIStore extends StoreProvider<I18nStoreState> {
  constructor() {
    super(initialState);
  }

  translate(key: string, params) {
    if (!this.state.labels[key]) {
      console.log(`[i18n] missing transation for "${key}"`);
      return key;
    }
    if (params) {
      return this.state.labels[key].replace(/\{(.*?)\}/g, (_, token) => params[token])
    }
    return this.state.labels[key];
  }
}
