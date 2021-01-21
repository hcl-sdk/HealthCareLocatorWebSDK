export const OKSDK_DEV_SETTINGS = '__onekey-sdk-dev-settings';
export const OKSDK_SEARCH_HISTORY = '__onekey-sdk-searchHistory';
export const OKSDK_GEOLOCATION_HISTORY = '__onekey-sdk-currentLocation';

type Key = typeof OKSDK_DEV_SETTINGS 
  | typeof OKSDK_SEARCH_HISTORY 
  | typeof OKSDK_GEOLOCATION_HISTORY;

export const storageUtils = {
  setObject(key: Key, value: any) {
    try {
      storageUtils.setItem(key, JSON.stringify(value));
    } catch(e) { 
      console.error("[storageUtils]",e.message) 
    }
  },
  getObject(key: Key, defaultValue = null) {
    try {
      return JSON.parse(storageUtils.getItem(key));
    } catch(e) {
      storageUtils.remove(key);
      return defaultValue;
    }
  },
  setItem(key: Key, value: any) {
    localStorage.setItem(key, value);
  },
  getItem(key: Key) {
    return localStorage.getItem(key);
  },
  remove(key: Key) {
    localStorage.removeItem(key);
  }
}