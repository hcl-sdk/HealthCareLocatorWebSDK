export const OKSDK_DEV_SETTINGS = '__hcl-sdk-dev-settings';
export const OKSDK_SEARCH_HISTORY = '__hcl-sdk-searchHistory';
export const OKSDK_GEOLOCATION_HISTORY = '__hcl-sdk-currentLocation';
export const OKSDK_MAP_HCP_VOTED = '__hcl-sdk-map-hcp-voted';

type Key = typeof OKSDK_DEV_SETTINGS
  | typeof OKSDK_SEARCH_HISTORY
  | typeof OKSDK_GEOLOCATION_HISTORY
  | typeof OKSDK_MAP_HCP_VOTED;

export const storageUtils = {
  setObject(key: Key, value: any) {
    try {
      storageUtils.setItem(key, JSON.stringify(value));
    } catch(e) {
      console.error("[storageUtils]",e.message)
    }
  },
  getObject(key: Key, defaultValue = null) {
    const obj = storageUtils.getItem(key);
    if (obj) {
      try {
        return JSON.parse(obj);
      } catch(e) {
        storageUtils.remove(key);
      }
    }
    return defaultValue;
  },
  setItem(key: Key, value: any) {
    try {
      window.localStorage.setItem(key, value);
    } catch (err) {}
  },
  getItem(key: Key) {
    try {
      return window.localStorage.getItem(key);
    } catch (err) {}
    return null;
  },
  remove(key: Key) {
    try {
      window.localStorage.removeItem(key);
    } catch (err) {}
  }
}
