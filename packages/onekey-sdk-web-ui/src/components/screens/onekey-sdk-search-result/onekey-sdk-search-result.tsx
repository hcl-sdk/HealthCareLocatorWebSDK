import { Component, Host, h, State, Listen, Fragment } from '@stencil/core';
import { getCssColor, getDoctorCardOffset } from '../../../utils/helper';
import { getAddressFromGeo } from '../../../core/api/searchGeo';
import { configStore, searchMapStore, uiStore } from '../../../core/stores';
import { ModeViewType } from '../../../core/stores/ConfigStore';
import animateScrollTo from '../../../utils/animatedScrollTo';
import cls from 'classnames';
import { getFullCardDetail, searchLocation } from '../../../core/api/hcp';
@Component({
  tag: 'onekey-sdk-search-result',
  styleUrl: 'onekey-sdk-search-result.scss',
  shadow: false,
})
export class OnekeySdkSearchResult {
  @State() isListViewMode: boolean = true;
  @State() selectedMarkerIdx: number;
  @State() isOpenPanel: boolean = true;

  componentWillLoad() {
    const params: any = {};
    if (searchMapStore.state.locationFilter) {
      params.location = {

      }
    }
    if (searchMapStore.state.specialtyFilter) {
      params.specialties = [searchMapStore.state.specialtyFilter.id];
    }
    searchLocation(params);
  }
  searchDataCardList;

  onItemCardClick = async item => {
    searchMapStore.setState({
      selectedActivity: { ...item },
    });

    await getFullCardDetail({
      id: item.id,
    });
  };

  @Listen('markerClick')
  onMarkerClick(e) {
    const selectedMarkerIdx = searchMapStore.state.specialties.findIndex(item => item.lat === e.detail.latlng.lat && item.lng === e.detail.latlng.lng);
    const doctorCardOffset = getDoctorCardOffset(this.searchDataCardList, selectedMarkerIdx);

    animateScrollTo(this.searchDataCardList, 'scrollLeft', doctorCardOffset, 1000);
    this.selectedMarkerIdx = selectedMarkerIdx;
  }

  @Listen('setCurrentLocation')
  setCurrentLocation(e) {
    getAddressFromGeo(e.detail.lat, e.detail.lng);
  }

  onBackToList = () => {
    searchMapStore.setState({
      selectedActivity: null,
    });
  };

  togglePanel = () => {
    this.isOpenPanel = !this.isOpenPanel;
  };

  onOpenSort = () => {
    configStore.setState({
      modal: {
        title: 'Sort',
        component: 'onekey-sdk-sort',
      },
    });
  };

  renderToolbar = (isSmall = false) => {
    const { specialties } = searchMapStore.state;
    const className = cls('search-toolbar search-section', {
      'header-block': isSmall,
    });
    return (
      <div class={className}>
        <div class="search-back-large hidden-mobile">
          <onekey-sdk-icon name="arrow" />
          <span class="text-small">Back to my last searches</span>
        </div>
        <div class="search-result__wrapper">
          <strong class="search-result__total">Results: </strong>
          <strong class="search-result__total-value text-primary text-bold">{specialties.length}</strong>
        </div>
        <div class="hidden-desktop hidden-tablet switch-mode">
          <onekey-sdk-switch-view-mode typeOfLabel="disabled" />
        </div>
        <div class="search-filter-wrapper">
          <div class="search-filter">
            <onekey-sdk-icon name="sort" width={15} height={9} onClick={this.onOpenSort} />
          </div>
        </div>
      </div>
    );
  };

  render() {
    if (!searchMapStore.state.search) {
      return null;
    }

    const { specialties, selectedActivity } = searchMapStore.state;

    const selectedAddressName = searchMapStore.state.selectedValues?.address?.address;
    const breakpoint = uiStore.state.breakpoint;
    const isSmall = breakpoint.screenSize === 'mobile';
    const isListView = configStore.state.modeView === ModeViewType.LIST;
    const modeView = configStore.state.modeView;
    const searchDataClass = cls('search-data', {
      'list-view': !isSmall || isListView,
    });

    const mapClass = cls('search-map__content');

    const mapWrapperClass = cls('search-map-wrapper', {
      hide: !this.isOpenPanel,
    });

    const wrapperClass = cls('search-result main-contain', `${modeView.toLowerCase()}-view-mode`, {
      'hcp-details': !!selectedActivity,
    });

    return (
      <Host class={wrapperClass}>
        {(!selectedActivity || !isSmall) &&
          (isSmall ? (
            <div class="header-block search-header search-section">
              <onekey-sdk-router-link url="/search" class="btn-back">
                <onekey-sdk-icon name="arrow" color={getCssColor('--onekeysdk-color-dark')} />
              </onekey-sdk-router-link>
              <div>
                <strong class="search-result-title">{searchMapStore.state.searchFields.name}</strong>
                <div class="search-result-address">{selectedAddressName || 'Canada'}</div>
              </div>
            </div>
          ) : (
            <onekey-sdk-search searchText="Search" showSwitchMode />
          ))}
        {isSmall && searchMapStore.state.loading ? (
          <onekey-sdk-loading class="body-block" style={{ position: 'relative' }}></onekey-sdk-loading>
        ) : (
          <Fragment>
            {isSmall && !selectedActivity && this.renderToolbar(true)}
            <div class="body-block">
              <div class={mapWrapperClass}>
                {selectedActivity ? <onekey-sdk-hcp-full-card goBack={this.onBackToList} /> : !isSmall && this.renderToolbar()}
                {!selectedActivity && (
                  <div class={searchDataClass} ref={el => (this.searchDataCardList = el as HTMLInputElement)}>
                    {specialties.map((elm, idx) => (
                      <onekey-sdk-doctor-card selected={this.selectedMarkerIdx === idx} {...elm} onClick={() => this.onItemCardClick(elm)} />
                    ))}
                  </div>
                )}
              </div>
              <div class="toggle-panel">
                <onekey-sdk-button icon="chevron-arrow" noBackground noBorder iconWidth={20} iconHeight={24} iconColor="black" onClick={this.togglePanel} />
              </div>

              {((!isListView && !isSmall) || (!isListView && !selectedActivity)) && (
                <onekey-sdk-map mapHeight={`100%`} class={mapClass} modeView={modeView} breakpoint={breakpoint} locations={specialties} selectedLocationIdx={0} defaultZoom={5} />
              )}
            </div>
          </Fragment>
        )}
      </Host>
    );
  }
}
