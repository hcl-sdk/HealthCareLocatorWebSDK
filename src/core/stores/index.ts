import RouterStore, { initStateRouterStore } from './RouterStore';
import ConfigStore, { initStateConfigStore } from './ConfigStore'
import SearchMapStore, { initStateSearchMapStore } from './SearchMap'
import StoreProvider, { initStateAppStore } from './StoreProvider';

export const appStore = new StoreProvider(initStateAppStore)
export const routerStore = new RouterStore(initStateRouterStore)
export const searchMapStore = new SearchMapStore(initStateSearchMapStore)
export const configStore = new ConfigStore(initStateConfigStore)
