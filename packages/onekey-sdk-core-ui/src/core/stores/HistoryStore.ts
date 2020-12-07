import StoreProvider from './StoreProvider';
import { HISTORY_SEARCH_ITEMS_MOCK, HISTORY_HCP_ITEMS_MOCK } from './dataMocks';

type HistoryItemType = 'search' | 'hcp';

interface HistorySearchItem {
  id: string;
  type: 'search';
  criteria: string;
  specialtyId?: string;
  address: string;
  timestamp: number;
}

interface HistoryHcpItem {
  id: string;
  type: 'hcp';
  hcpName: string;
  hcpSpecialty: string;
  address: string;
  timestamp: number;
}

interface HistoryStoreState {
  searchItems: HistorySearchItem[];
  hcpItems: HistoryHcpItem[];
}

const initialData: HistoryStoreState = {
  searchItems: HISTORY_SEARCH_ITEMS_MOCK as HistorySearchItem[],
  hcpItems: HISTORY_HCP_ITEMS_MOCK as HistoryHcpItem[]
};

export default class HistoryStore extends StoreProvider<HistoryStoreState> {
  constructor() {
    super(initialData);
  }

  addItem(itemType: HistoryItemType, item: HistoryHcpItem | HistorySearchItem) {
    switch (itemType) {
      case 'hcp':
        this.state.hcpItems.push(item as HistoryHcpItem);
        break;
      case 'search':
        this.state.searchItems.push(item as HistorySearchItem);
        break;
    }
  }

  removeItem(itemType: HistoryItemType, itemId: string) {
    switch (itemType) {
      case 'hcp':
        this.state.hcpItems = this.state.hcpItems.filter(item => item.id !== itemId);
        break;
      case 'search':
        this.state.searchItems = this.state.searchItems.filter(item => item.id !== itemId);
        break;
    }
  }
}
