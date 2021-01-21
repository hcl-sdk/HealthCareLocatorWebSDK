import { formatDistance } from 'date-fns';
import { Component, h, Host, State, Listen } from '@stencil/core';
import { configStore, historyStore, routerStore, searchMapStore } from '../../../../core/stores';
import { t } from '../../../../utils/i18n';
import { NEAR_ME_ITEM, HISTORY_ITEMS_TO_DISPLAY, HISTORY_MAX_TOTAL_ITEMS } from '../../../../core/constants';
import { HistoryHcpItem, HistorySearchItem } from '../../../../core/stores/HistoryStore';
import { ModeViewType } from '../../../../core/stores/ConfigStore';
@Component({
  tag: 'onekey-sdk-home-full',
  shadow: false,
})
export class OnekeySdkHomeFull {
  @State() showMoreSearchItems: boolean = false;
  @State() showMoreHcpItems: boolean = false;

  @Listen('mapClicked')
  onMapClicked() {
    searchMapStore.setSearchFieldValue('address', t('near_me'));
    searchMapStore.setState({
      locationFilter: NEAR_ME_ITEM,
      specialtyFilter: null,
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
    routerStore.push('/search-result');
  };

  removeHistoryItem = (itemType: 'search' | 'hcp', id: string) => (e: Event) => {
    e.stopPropagation();
    historyStore.removeItem(itemType, id);
  };

  renderViewMore(items: any[], showMoreState: string) {
    if (this[showMoreState]) {
      return <button onClick={() => (this[showMoreState] = false)}>View less</button>;
    }
    if (!this[showMoreState] && items.length > HISTORY_ITEMS_TO_DISPLAY) {
      return <button onClick={() => (this[showMoreState] = true)}>View more</button>;
    }
    return null;
  }

  renderSearchHistory() {
    return historyStore.state.searchItems.filter(this.filterHistoryItems(this.showMoreSearchItems)).map(searchItem => (
      <div class="history-item" onClick={() => this.handleHistorySearchItemClick(searchItem)}>
        <onekey-sdk-button noBorder noBackground icon="remove" iconWidth={12} iconHeight={12} iconColor="black" onClick={this.removeHistoryItem('search', searchItem.id)} />
        <p class="history-item__criteria">{searchItem.searchFields.name}</p>
        <p class="history-item__address">{searchItem.locationFilter?.longLabel || searchItem.searchFields.address}</p>
        <p class="history-item__time-from">{formatDistance(searchItem.timestamp, Date.now())}</p>
      </div>
    ));
  }

  renderHcpHistory() {
    return historyStore.state.hcpItems.filter(this.filterHistoryItems(this.showMoreHcpItems)).map(hcpItem => (
      <div class="history-item" onClick={() => this.handleHistoryHcpItemClick(hcpItem)}>
        <onekey-sdk-button noBorder noBackground icon="remove" iconWidth={12} iconHeight={12} iconColor="black" onClick={this.removeHistoryItem('hcp', hcpItem.activityId)} />
        <p class="history-item__name">{hcpItem.activity.individual.mailingName}</p>
        <p class="history-item__specialty">{hcpItem.activity.individual.professionalType.label}</p>
        <p class="history-item__address">{hcpItem.activity.workplace.address.longLabel}</p>
        <p class="history-item__time-from">{formatDistance(hcpItem.timestamp, Date.now())}</p>
      </div>
    ));
  }

  render() {
    const { geoLocation } = searchMapStore.state;
    const { searchItems, hcpItems } = historyStore.state;
    const mapHeight = !searchItems.length && !hcpItems.length ? '200px' : '100px';

    return (
      <Host>
        { geoLocation.status === 'granted' && (
          <div class="card card--near-me">
            <div class="card__title-wrapper">
              <h3 class="card__title">{t('hcps_near_me')}</h3>
            </div>
            <div class="card__content-wrapper card__content-wrapper--with-padding">
              <onekey-sdk-map
                class="info-section-body__map"
                locations={[{
                  lat: searchMapStore.state.geoLocation.latitude,
                  lng: searchMapStore.state.geoLocation.longitude
                }]}
                selectedLocationIdx={0}
                defaultZoom={10}
                noCurrentLocation
                zoomControl={false}
                mapHeight={mapHeight}
                dragging={false}
                interactive={false}
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
