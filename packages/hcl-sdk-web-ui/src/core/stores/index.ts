import RouterStore, { initStateRouterStore } from './RouterStore';
import ConfigStore, { initStateConfigStore, ModeViewType } from './ConfigStore'
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

// Observe Change

configStore.onChange('modeView', (newModeView: ModeViewType) => {
  const isFreeTextName = searchMapStore.state.searchFields.name;
  const isGrantedGeoloc = searchMapStore.isGrantedGeoloc;

  // Constraint default sort based on map view changes
  let sortValues = {
    lastName: false,
    distanceNumber: false,
    relevance: true,
  };

  if (!isGrantedGeoloc && ModeViewType.MAP === newModeView) {
    sortValues = {
      lastName: !isFreeTextName,
      relevance: !!isFreeTextName,
      distanceNumber: false,
    };
  } else {
    sortValues = {
      lastName: ModeViewType.LIST === newModeView && !isFreeTextName,
      relevance: ModeViewType.LIST === newModeView && !!isFreeTextName,
      distanceNumber: ModeViewType.MAP === newModeView,
    };
  }

  searchMapStore.setSortValues(sortValues);
})