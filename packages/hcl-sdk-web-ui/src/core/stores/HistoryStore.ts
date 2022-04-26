import { Activity } from '../../../../hcl-sdk-core/src/graphql/types';
import { OKSDK_SEARCH_HISTORY, storageUtils } from '../../utils/storageUtils';
import { CountryCode, HISTORY_MAX_TOTAL_ITEMS } from '../constants';
import ConfigStore from './ConfigStore';
import { SearchFields, SearchMapState, SearchTermItem, SEARCH_TARGET, SpecialtyItem } from './SearchMapStore';
import StoreProvider from './StoreProvider';

type HistoryItemType = 'search' | 'hcp' | 'hco';

export interface HistorySearchItem {
  id: string;
  type: 'search';
  locationFilter: any;
  specialtyFilter?: SpecialtyItem[];
  medicalTermsFilter?: SearchTermItem;
  searchFields: SearchFields;
  timestamp: number;
  countryFilter: CountryCode
  searchTarget?: SEARCH_TARGET;
}

export interface HistoryHcpItem {
  activityId: string;
  type: 'hcp';
  activity: {
    id: Activity['id'];
    individual: Activity['individual'];
    workplace: Activity['workplace'];
  };
  timestamp: number;
}

export interface HistoryHcoItem {
  hcoId: string;
  type: 'hco';
  hco: SearchMapState['selectedHco'];
  timestamp: number;
}

interface HistoryStoreState {
  searchItems: HistorySearchItem[];
  lastConsultedItems: (HistoryHcpItem | HistoryHcoItem)[];
}

const defaultHistory = {
  searchItems: [],
  lastConsultedItems: [],
};

function loadHistory() {
  return storageUtils.getObject(OKSDK_SEARCH_HISTORY, {
    searchItems: [],
    lastConsultedItems: [],
  });
}

function storeHistory(history: HistoryStoreState) {
  if (!history) {
    return;
  }
  storageUtils.setObject(OKSDK_SEARCH_HISTORY, history);
}

const history = loadHistory();
const initialData: HistoryStoreState = {
  ...defaultHistory,
  ...history,
};

export default class HistoryStore extends StoreProvider<HistoryStoreState> {
  constructor() {
    super(initialData);
  }

  addItem(item: HistoryHcoItem | HistoryHcpItem | HistorySearchItem) {
    switch (item.type) {
      case 'hco':
      case 'hcp': {
        const found = this.state.lastConsultedItems.filter(i => getId(i) === getId(item))[0];
        if (!found) {
          this.state.lastConsultedItems.unshift(item as HistoryHcpItem);
          if (this.state.lastConsultedItems.length > HISTORY_MAX_TOTAL_ITEMS) {
            this.state.lastConsultedItems.length = HISTORY_MAX_TOTAL_ITEMS;
          }
        } else {
          // Item already exists, update and move to top
          this.updateItem('lastConsultedItems', found);
        }
        break;
      }
      case 'search': {
        const searchItem = item as HistorySearchItem;
        const found = this.state.searchItems.filter(i => {
          return (
            JSON.stringify({ s: i.specialtyFilter, a: i.locationFilter, f: i.searchFields, t: i.searchTarget }) ===
            JSON.stringify({ s: searchItem.specialtyFilter, a: searchItem.locationFilter, f: searchItem.searchFields, t: searchItem.searchTarget })
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
      case 'hco':
      case 'hcp': {
        this.state.lastConsultedItems = this.state.lastConsultedItems.filter(item => getId(item) !== itemId);
        break;
      }
      case 'search': {
        this.state.searchItems = this.state.searchItems.filter(item => item.id !== itemId);
        break;
      }
    }
    storeHistory(this.state);
  }

  updateItem(key: 'searchItems' | 'lastConsultedItems', item: any) {
    const updated = { ...item };
    updated.timestamp = Date.now();
    const nextState = [...this.state[key]];
    nextState.splice(this.state[key].indexOf(item), 1);
    nextState.unshift(updated);
    this.state[key] = nextState as any;
  }
}

function getId(historyItem: HistoryHcoItem | HistoryHcpItem) {
  if (historyItem.type === 'hco') {
    return (historyItem as HistoryHcoItem).hcoId;
  } else if (historyItem.type === 'hcp') {
    return (historyItem as HistoryHcpItem).activityId;
  }
  return null;
}

export function createHCOHistoryItem(hcoDetail: SearchMapState['hcoDetail']): HistoryHcoItem {
  return {
    hcoId: hcoDetail.id,
    hco: {
      id: hcoDetail.id,
      name: hcoDetail.name,
      address: hcoDetail.address,
      lat: hcoDetail.lat,
      lng: hcoDetail.lng,
      type: hcoDetail.type,
    },
    type: 'hco',
    timestamp: Date.now(),
  };
}

export function createHCPHistoryItem(activity: HistoryHcpItem['activity']): HistoryHcpItem {
  return {
    activityId: activity.id,
    activity,
    type: 'hcp',
    timestamp: Date.now(),
  };
}

export function createSearchHistoryItem({
  locationFilter,
  specialtyFilter,
  medicalTermsFilter,
  searchFields,
  countryFilter,
  searchTarget,
}: {
  locationFilter: SearchMapState['locationFilter'];
  specialtyFilter: SearchMapState['specialtyFilter'];
  medicalTermsFilter: SearchMapState['medicalTermsFilter'];
  searchFields: SearchMapState['searchFields'];
  countryFilter: ConfigStore['countryGraphqlQuery'];
  searchTarget: SearchMapState['searchTarget'];
}): HistorySearchItem {
  return {
    id: String(Date.now()),
    type: 'search',
    timestamp: Date.now(),
    locationFilter: locationFilter,
    specialtyFilter: specialtyFilter,
    medicalTermsFilter: medicalTermsFilter,
    searchFields: searchFields,
    searchTarget,
    countryFilter,
  };
}
