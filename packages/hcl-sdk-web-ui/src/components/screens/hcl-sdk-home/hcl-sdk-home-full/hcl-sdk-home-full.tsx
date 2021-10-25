import { Component, h, Host, State, Listen } from '@stencil/core';
import { historyStore, routerStore, searchMapStore, i18nStore, configStore } from '../../../../core/stores';
import { t } from '../../../../utils/i18n';
import { HISTORY_ITEMS_TO_DISPLAY, HISTORY_MAX_TOTAL_ITEMS, NEAR_ME_ITEM } from '../../../../core/constants';
import { HistoryHcpItem, HistorySearchItem } from '../../../../core/stores/HistoryStore';
import { searchLocationWithParams } from '../../../../core/api/hcp';
import { formatDistance } from '../../../../utils/dateUtils';
import { getHcpFullname } from '../../../../utils/helper';
import { SearchFields } from '../../../../core/stores/SearchMapStore';

@Component({
  tag: 'hcl-sdk-home-full',
  shadow: false,
})
export class HclSdkHomeFull {
  @State() showMoreSearchItems: boolean = false;
  @State() showMoreHcpItems: boolean = false;

  componentDidLoad() {
    configStore.storeInstance.onChange('countryGeo', this.onChangeGeoCountry)

    if (searchMapStore.isGrantedGeoloc && configStore.state.countryGeo) {
      searchLocationWithParams(true);
    }
  }

  @Listen('mapClicked')
  onMapClicked() {
    if (searchMapStore.state.loadingActivitiesStatus !== 'success') {
      return
    }

    searchMapStore.setState({
      locationFilter: NEAR_ME_ITEM,
      specialtyFilter: [],
      medicalTermsFilter: null,
      searchFields: {
        name: '',
        medicalTerm: '',
        specialtyName: '',
        address: t('near_me')
      },
      navigatedFromHome: true
    });
    routerStore.push('/search-result');
  }

  onChangeGeoCountry = (newGeoCountry: string) => {
    if (newGeoCountry) {
      searchLocationWithParams(true);
    }
  }

  filterHistoryItems = (showMore: boolean) => (_: any, index: number) => {
    if (showMore) {
      return index < HISTORY_MAX_TOTAL_ITEMS;
    }
    return index < HISTORY_ITEMS_TO_DISPLAY;
  };

  handleHistoryHcpItemClick = (hcpItem: HistoryHcpItem) => {
    searchMapStore.resetDataSearch({
      isResetHCPDetail: true,
      isResetSearchFields: true,
    })
    searchMapStore.setState({
      searchFields: {
        ...searchMapStore.state.searchFields,
        name: getHcpFullname(hcpItem.activity.individual)
      },
      selectedActivity: {
        ...hcpItem.activity,
        name: getHcpFullname(hcpItem.activity.individual),
        lat: hcpItem.activity.workplace.address.location.lat,
        lng: hcpItem.activity.workplace.address.location.lon,
      },
      navigatedFromHome: true
    });
    routerStore.push('/search-result');
  };

  handleHistorySearchItemClick = (searchItem: HistorySearchItem) => {
    const { locationFilter, specialtyFilter, searchFields, medicalTermsFilter } = searchItem;

    searchMapStore.setState({
      locationFilter,
      specialtyFilter,
      medicalTermsFilter,
      searchFields,
      loadingActivitiesStatus: 'loading',
      specialties: [],
      specialtiesRaw: []
    });

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

  renderSearchCriterias(searchFields: SearchFields) {
    return [
      searchFields.name,
      searchFields.specialtyName,
      searchFields.medicalTerm
    ].filter(s => s).join(', ')
  }

  renderSearchHistory() {
    return historyStore.state.searchItems.filter(this.filterHistoryItems(this.showMoreSearchItems)).map(searchItem => (
      <div class="history-item" onClick={() => this.handleHistorySearchItemClick(searchItem)}>
        <hcl-sdk-button noBorder noBackground icon="remove" iconWidth={12} iconHeight={12} onClick={this.removeHistoryItem('search', searchItem.id)} />
        <p class="history-item__criteria">{this.renderSearchCriterias(searchItem.searchFields)}</p>
        <p class="history-item__address">{searchItem.locationFilter?.longLabel || searchItem.searchFields.address}</p>
        <p class="history-item__time-from">{formatDistance(searchItem.timestamp, i18nStore.state.lang)}</p>
      </div>
    ));
  }

  renderHcpHistory() {
    return historyStore.state.hcpItems.filter(this.filterHistoryItems(this.showMoreHcpItems)).map(hcpItem => (
      <div class="history-item" onClick={() => this.handleHistoryHcpItemClick(hcpItem)}>
        <hcl-sdk-button noBorder noBackground icon="remove" iconWidth={12} iconHeight={12} onClick={this.removeHistoryItem('hcp', hcpItem.activityId)} />
        <p class="history-item__name">{getHcpFullname(hcpItem.activity.individual)}</p>
        <p class="history-item__specialty">{hcpItem.activity.individual.specialties?.[0].label}</p>
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
