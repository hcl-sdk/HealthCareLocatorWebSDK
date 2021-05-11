import { Component, h, Host, State, Listen } from '@stencil/core';
import { configStore, historyStore, routerStore, searchMapStore, i18nStore } from '../../../../core/stores';
import { t } from '../../../../utils/i18n';
import { HISTORY_ITEMS_TO_DISPLAY, HISTORY_MAX_TOTAL_ITEMS, NEAR_ME } from '../../../../core/constants';
import { HistoryHcpItem, HistorySearchItem } from '../../../../core/stores/HistoryStore';
import { ModeViewType } from '../../../../core/stores/ConfigStore';
import { searchLocationWithParams } from '../../../../core/api/hcp';
import { formatDistance } from '../../../../utils/dateUtils';

@Component({
  tag: 'hcl-sdk-home-full',
  shadow: false,
})
export class HclSdkHomeFull {
  @State() showMoreSearchItems: boolean = false;
  @State() showMoreHcpItems: boolean = false;

  componentDidLoad() {
    if (searchMapStore.isGrantedGeoloc) {
      // Forced search Near Me, no need to set the input address value
      searchLocationWithParams(true);
    }
  }

  @Listen('mapClicked')
  onMapClicked() {
    searchMapStore.setSearchFieldValue('address', t('near_me'));
    searchMapStore.setState({
      locationFilter: null,
      specialtyFilter: null
    });
    configStore.setState({
      modeView: ModeViewType.MAP
    })
    routerStore.push('/search-result');
  }

  filterHistoryItems = (showMore: boolean) => (_: any, index: number) => {
    if (showMore) {
      return index < HISTORY_MAX_TOTAL_ITEMS;
    }
    return index < HISTORY_ITEMS_TO_DISPLAY;
  };

  handleHistoryHcpItemClick = (hcpItem: HistoryHcpItem) => {
    searchMapStore.setState({
      selectedActivity: {
        ...hcpItem.activity,
        name: hcpItem.activity.individual.mailingName,
        lat: hcpItem.activity.workplace.address.location.lat,
        lng: hcpItem.activity.workplace.address.location.lon,
      },
      navigatedFromHome: true
    });
    routerStore.push('/search-result');
  };

  handleHistorySearchItemClick = (searchItem: HistorySearchItem) => {
    const { locationFilter, specialtyFilter, searchFields } = searchItem;
    searchMapStore.setState({
      locationFilter,
      specialtyFilter,
      searchFields,
    });

    if (locationFilter && locationFilter.id === NEAR_ME) {
      configStore.setState({
        modeView: ModeViewType.MAP
      });
    }

    routerStore.push('/search-result');
  };

  removeHistoryItem = (itemType: 'search' | 'hcp', id: string) => (e: Event) => {
    e.stopPropagation();
    historyStore.removeItem(itemType, id);
  };

  renderViewMore(items: any[], showMoreState: string) {
    if (this[showMoreState]) {
      return <button onClick={() => (this[showMoreState] = false)}>{t('view_less')}</button>;
    }
    if (!this[showMoreState] && items.length > HISTORY_ITEMS_TO_DISPLAY) {
      return <button onClick={() => (this[showMoreState] = true)}>{t('view_more')}</button>;
    }
    return null;
  }

  renderSearchHistory() {
    return historyStore.state.searchItems.filter(this.filterHistoryItems(this.showMoreSearchItems)).map(searchItem => (
      <div class="history-item" onClick={() => this.handleHistorySearchItemClick(searchItem)}>
        <hcl-sdk-button noBorder noBackground icon="remove" iconWidth={12} iconHeight={12} iconColor="black" onClick={this.removeHistoryItem('search', searchItem.id)} />
        <p class="history-item__criteria">{searchItem.searchFields.name}</p>
        <p class="history-item__address">{searchItem.locationFilter?.longLabel || searchItem.searchFields.address}</p>
        <p class="history-item__time-from">{formatDistance(searchItem.timestamp, i18nStore.state.lang)}</p>
      </div>
    ));
  }

  renderHcpHistory() {
    return historyStore.state.hcpItems.filter(this.filterHistoryItems(this.showMoreHcpItems)).map(hcpItem => (
      <div class="history-item" onClick={() => this.handleHistoryHcpItemClick(hcpItem)}>
        <hcl-sdk-button noBorder noBackground icon="remove" iconWidth={12} iconHeight={12} iconColor="black" onClick={this.removeHistoryItem('hcp', hcpItem.activityId)} />
        <p class="history-item__name">{hcpItem.activity.individual.mailingName}</p>
        <p class="history-item__specialty">{hcpItem.activity.individual.professionalType.label}</p>
        <p class="history-item__address">{hcpItem.activity.workplace.address.longLabel}</p>
        <p class="history-item__time-from">{formatDistance(hcpItem.timestamp, i18nStore.state.lang)}</p>
      </div>
    ));
  }

  render() {
    const { searchItems, hcpItems } = historyStore.state;
    const mapHeight = !searchItems.length && !hcpItems.length ? '200px' : '100px';
    const { specialties } = searchMapStore.state;

    return (
      <Host>
        { searchMapStore.isGrantedGeoloc && (
          <div class="card card--near-me">
            <div class="card__title-wrapper">
              <h3 class="card__title">{t('hcps_near_me')}</h3>
            </div>
            <div class="card__content-wrapper card__content-wrapper--with-padding">
              <hcl-sdk-map
                class="info-section-body__map"
                locations={specialties}
                selectedLocationIdx={0}
                noCurrentLocation
                zoomControl={false}
                mapHeight={mapHeight}
                dragging={false}
                interactive={false}
                isShowMeMarker={true}
                isForcedZoomToMe={true}
              />
            </div>
          </div>
        ) }
        {!!searchItems.length && (
          <div class="card">
            <div class="card__title-wrapper">
              <h3 class="card__title">{t('last_searches')}</h3>
              {this.renderViewMore(searchItems, 'showMoreSearchItems')}
            </div>
            <div class="card__content-wrapper">{this.renderSearchHistory()}</div>
          </div>
        )}
        {!!hcpItems.length && (
          <div class="card">
            <div class="card__title-wrapper">
              <h3 class="card__title">{t('last_hcps_consulted')}</h3>
              {this.renderViewMore(hcpItems, 'showMoreHcpItems')}
            </div>
            <div class="card__content-wrapper">{this.renderHcpHistory()}</div>
          </div>
        )}
      </Host>
    );
  }
}
