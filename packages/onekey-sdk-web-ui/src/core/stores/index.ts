import RouterStore, { initStateRouterStore } from './RouterStore';
import ConfigStore, { initStateConfigStore } from './ConfigStore'
import UIStore from './UIStore'
import I18nStore from './I18nStore'
import HistoryStore from './HistoryStore'
import SearchMapStore, { initStateSearchMapStore } from './SearchMapStore'
import StoreProvider, { initStateAppStore } from './StoreProvider';

export const appStore = new StoreProvider(initStateAppStore)
export const routerStore = new RouterStore(initStateRouterStore)
export const searchMapStore = new SearchMapStore(initStateSearchMapStore)
export const configStore = new ConfigStore(initStateConfigStore)
export const historyStore = new HistoryStore();
export const uiStore = new UIStore();
export const i18nStore = new I18nStore();
