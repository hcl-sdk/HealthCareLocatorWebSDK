import { Component, Host, h, State, Listen, Fragment } from '@stencil/core';
import { getCssColor, getDoctorCardOffset } from '../../../utils/helper';
import { getAddressFromGeo } from '../../../core/api/searchGeo';
import { configStore, searchMapStore, uiStore, routerStore } from '../../../core/stores';
import { ModeViewType } from '../../../core/stores/ConfigStore';
import animateScrollTo from '../../../utils/animatedScrollTo';
import cls from 'classnames';
import { searchLocationWithParams } from '../../../core/api/hcp';
import { NEAR_ME } from '../../../core/constants';
import { t } from '../../../utils/i18n';
@Component({
  tag: 'onekey-sdk-search-result',
  styleUrl: 'onekey-sdk-search-result.scss',
  shadow: false,
})
export class OnekeySdkSearchResult {
  @State() selectedMarkerIdx: number;
  @State() isOpenPanel: boolean = true;

  disconnectedCallback() {
    searchMapStore.setState({
      selectedActivity: null,
      individualDetail: null,
      searchDoctor: [],
      specialties: [],
      searchFields: { name: '', address: '' },
    });
    configStore.setState({
      modeView: ModeViewType.LIST
    })
  }
  componentWillLoad() {
    if (!searchMapStore.state.selectedActivity) {
      searchLocationWithParams()
    }
  }
  searchDataCardList;
  searchDataMapElm;

  onItemCardClick = async item => {
    searchMapStore.setState({
      selectedActivity: item,
      individualDetail: null,
    });
  };

  @Listen('backFromHcpFullCard')
  backFromHcpFullCardHandler() {
    const { locationFilter, specialtyFilter } = searchMapStore.state;
    if (locationFilter === null && specialtyFilter === null) {
      searchMapStore.setState({
        selectedActivity: null,
        individualDetail: null,
      });
      this.goBackToHome();
      return;
    }
    this.goBackToList();
  }

  @Listen('markerClick')
  onMarkerClick(e) {
    const breakpoint = uiStore.state.breakpoint;
    const selectedMarkerIdx = searchMapStore.state.specialties.findIndex(item => item.lat === e.detail.latlng.lat && item.lng === e.detail.latlng.lng);
    const isSmall = breakpoint.screenSize === 'mobile';
    const elm = isSmall ? this.searchDataCardList : this.searchDataMapElm
    const doctorCardOffset = getDoctorCardOffset(elm, selectedMarkerIdx, !isSmall);

    animateScrollTo({
      element: elm,
      scrollDirection: isSmall ? 'scrollLeft': 'scrollTop',
      to: doctorCardOffset,
      duration: 1000
    });
    this.selectedMarkerIdx = selectedMarkerIdx;
  }

  @Listen('setCurrentLocation')
  setCurrentLocation(e) {
    getAddressFromGeo(e.detail.lat, e.detail.lng);
  }

  goBackToList = () => {
    searchMapStore.setState({
      selectedActivity: null,
      individualDetail: null
    });
  };

  togglePanel = () => {
    this.isOpenPanel = !this.isOpenPanel;
  };

  onOpenSort = () => {
    configStore.setState({
      modal: {
        title: t('sort_label'),
        component: 'onekey-sdk-sort',
      },
    });
  };

  goBackToHome = () => {
    routerStore.back();
  };

  goToSearch = () => {
    routerStore.push('/search');
  };

  renderToolbar = (isSmall = false) => {
    const { specialties } = searchMapStore.state;
    const className = cls('search-toolbar', {
      'header-block': isSmall,
    });


    return (
      <div class={className}>
        <div class="search-back-large hidden-mobile">
          <onekey-sdk-button noBorder noBackground icon="arrow" iconColor={getCssColor('--onekeysdk-color-dark')} onClick={() => this.goBackToHome()}>
            <span class="text-small">{t('back_to_home')}</span>
          </onekey-sdk-button>
        </div>
        <div class="search-result__wrapper">
          <strong class="search-result__total">{t('results_label')}: </strong>
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

  getLocationsMapSingle() {
    const { selectedActivity, individualDetail } = searchMapStore.state;
    if (individualDetail) {
      return [{ lat: individualDetail.lat, lng: individualDetail.lng }]
    }
    if (selectedActivity) {
      return [{ lat: selectedActivity.lat, lng: selectedActivity.lng }]
    }
    return null;
  }

  render() {
    if (!searchMapStore.state.search) {
      return null;
    }

    const {
      specialties,
      selectedActivity,
      locationFilter,
      searchFields,
      loadingActivities,
      individualDetail
    } = searchMapStore.state;

    const selectedAddressName = locationFilter?.id === NEAR_ME ? t('near_me') : searchFields.address;
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
      'with-nearme': locationFilter?.id === NEAR_ME && searchFields.name === '',
    });

    const injectedMapProps = {
      mapHeight: '100%',
      class: mapClass, 
      modeView: modeView, 
      selectedLocationIdx: 0,
      defaultZoom: 5
    }

    const isShowHCPDetail = individualDetail || selectedActivity;
    const isShowNoResults = !loadingActivities && specialties && !specialties.length && !isShowHCPDetail;
    const isShowToolbar = {
      mobile: !loadingActivities && isSmall && !selectedActivity,
      desktop: !loadingActivities && !isSmall,
    }
    const isShowMapSingle = !isListView && isShowHCPDetail && !isSmall;
    const isShowMapCluster = !isListView && !isShowHCPDetail && specialties && specialties.length;
    
    const locationsMapSingle = this.getLocationsMapSingle();

    return (
      <Host class={wrapperClass}>
        {(!selectedActivity || !isSmall) &&
          (isSmall ? (
            <div class="header-block search-header search-section">
              <onekey-sdk-button
                class="btn-back"
                iconWidth={27}
                iconHeight={27}
                noBorder
                noBackground
                icon="arrow"
                iconColor={getCssColor('--onekeysdk-color-dark')}
                onClick={() => this.goBackToHome()}
              ></onekey-sdk-button>
              <div class="header-infos">
                {locationFilter?.id === NEAR_ME && searchFields.name === '' ? (
                  <div class="search-home-hpc" onClick={this.goToSearch}>
                    <input class="search-input" placeholder="Find Healthcare Professional" />
                    <onekey-sdk-button primary icon="search" class="oksdk-btn-search-address" />
                  </div>
                ) : (
                  <Fragment>
                    <strong class="search-result-title">{searchMapStore.state.searchFields.name}</strong>
                    <div class="search-result-address">{selectedAddressName || 'Canada'}</div>
                  </Fragment>
                )}
              </div>
            </div>
          ) : (
            <onekey-sdk-search searchText={t('search')} showSwitchMode />
          ))}

        {
          isShowNoResults ? (
            <onekey-sdk-search-no-results />
          ) : (
            <Fragment>
              {isShowToolbar.mobile && this.renderToolbar(true)}
              <div class="body-block">
                <div class={mapWrapperClass} ref={el => (this.searchDataMapElm = el as HTMLInputElement)}>
                  {selectedActivity ? <onekey-sdk-hcp-full-card /> : isShowToolbar.desktop && this.renderToolbar()}
                  {!selectedActivity && (
                    <div class={searchDataClass} ref={el => (this.searchDataCardList = el as HTMLInputElement)}>
                      {!loadingActivities && specialties.map((elm, idx) => (
                        <onekey-sdk-doctor-card selected={this.selectedMarkerIdx === idx} {...elm} onClick={() => this.onItemCardClick(elm)} />
                      ))}
                      {loadingActivities && (
                        <div class="search-result__loading">
                          <onekey-sdk-icon name="circular" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div class="toggle-panel">
                  <onekey-sdk-button icon="chevron-arrow" noBackground noBorder iconWidth={20} iconHeight={24} iconColor="black" onClick={this.togglePanel} />
                </div>

                {
                  isShowMapCluster && (
                    <onekey-sdk-map
                      key="map-cluster"
                      breakpoint={breakpoint}
                      locations={specialties}
                      {...injectedMapProps}
                    />
                  )
                }

                {
                  isShowMapSingle && (
                    <onekey-sdk-map 
                      key="map-single"
                      locations={locationsMapSingle}
                      noCurrentLocation
                      {...injectedMapProps}
                    />
                  )
                }
              </div>
            </Fragment>
          )
        }
      </Host>
    );
  }
}
