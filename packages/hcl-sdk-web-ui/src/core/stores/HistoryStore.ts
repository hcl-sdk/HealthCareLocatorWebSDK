import { OKSDK_SEARCH_HISTORY, storageUtils } from '../../utils/storageUtils';
import { HISTORY_MAX_TOTAL_ITEMS } from '../constants';
import StoreProvider from './StoreProvider';

type HistoryItemType = 'search' | 'hcp';

export interface HistorySearchItem {
  id: string;
  type: 'search';
  locationFilter: any;
  specialtyFilter: any;
  searchFields: any;
  timestamp: number;
}

export interface HistoryHcpItem {
  activityId: string;
  type: 'hcp';
  activity: any;
  timestamp: number;
}

interface HistoryStoreState {
  searchItems: HistorySearchItem[];
  hcpItems: HistoryHcpItem[];
}

function loadHistory() {
  return storageUtils.getObject(OKSDK_SEARCH_HISTORY, {
    searchItems: [],
    hcpItems: [],
  })
}

function storeHistory(history: HistoryStoreState) {
  if (!history) {
    return;
  }
  storageUtils.setObject(OKSDK_SEARCH_HISTORY, history);
}

const initialData: HistoryStoreState = loadHistory();

export default class HistoryStore extends StoreProvider<HistoryStoreState> {
  constructor() {
    super(initialData);
  }

  addItem(itemType: HistoryItemType, item: HistoryHcpItem | HistorySearchItem) {
    switch (itemType) {
      case 'hcp': {
        const hcpItem = item as HistoryHcpItem;
        const found = this.state.hcpItems.filter(i => i.activityId === hcpItem.activityId)[0];
        if (!found) {
          this.state.hcpItems.unshift(item as HistoryHcpItem);
          if (this.state.hcpItems.length > HISTORY_MAX_TOTAL_ITEMS) {
            this.state.hcpItems.length = HISTORY_MAX_TOTAL_ITEMS;
          }
        } else {
          // Item already exists, update and move to top
          this.updateItem('hcpItems', found);
        }
        break;
      }
      case 'search': {
        const hcpItem = item as HistorySearchItem;
        const found = this.state.searchItems.filter(i => {
          return (
            JSON.stringify({ s: i.specialtyFilter, a: i.locationFilter, f: i.searchFields }) ===
            JSON.stringify({ s: hcpItem.specialtyFilter, a: hcpItem.locationFilter, f: hcpItem.searchFields })
          );
        })[0];
        if (!found) {
          this.state.searchItems.unshift(item as HistorySearchItem);
          if (this.state.searchItems.length > HISTORY_MAX_TOTAL_ITEMS) {
            this.state.searchItems.length = HISTORY_MAX_TOTAL_ITEMS;
          }
        } else {
          // Item already exists, update and move to top
          this.updateItem('searchItems', found);
        }
        break;
      }
    }
    storeHistory(this.state);
  }

  removeItem(itemType: HistoryItemType, itemId: string) {
    switch (itemType) {
      case 'hcp': {
        this.state.hcpItems = this.state.hcpItems.filter(item => item.activityId !== itemId);
        break;
      }
      case 'search': {
        this.state.searchItems = this.state.searchItems.filter(item => item.id !== itemId);
        break;
      }
    }
    storeHistory(this.state);
  }

  updateItem(key: 'searchItems' | 'hcpItems', item: any) {
    const updated = { ...item };
    updated.timestamp = Date.now();
    const nextState = [...this.state[key]];
    nextState.splice(this.state[key].indexOf(item), 1);
    nextState.unshift(updated);
    this.state[key] = nextState as any;
  }
}
