import { Component, Host, h, State, Listen, Fragment } from '@stencil/core';
import { getCssColor, getDoctorCardOffset } from '../../../utils/helper';
import { getAddressFromGeo } from '../../../core/api/searchGeo';
import { configStore, searchMapStore, uiStore, routerStore } from '../../../core/stores';
import { ModeViewType } from '../../../core/stores/ConfigStore';
import animateScrollTo from '../../../utils/animatedScrollTo';
import cls from 'classnames';
import { genSearchLocationParams, groupPointFromBoundingBox, searchLocation, searchLocationWithParams } from '../../../core/api/hcp';
import { NEAR_ME } from '../../../core/constants';
import { LatLng } from 'leaflet';
import { t } from '../../../utils/i18n';
import { getDistance } from 'geolib';

@Component({
  tag: 'hcl-sdk-search-result',
  styleUrl: 'hcl-sdk-search-result.scss',
  shadow: false,
})
export class HclSdkSearchResult {
  @State() selectedMarkerLocation = { lat: -1, lng: -1 };
  @State() isOpenPanel: boolean = true;
  @State() isShowRelaunchBtn: boolean = false;
  @State() newDragLocation: LatLng;
  @State() newDragBoundingBox: string[]; // [south, north, west, east]
  @State() isLoadingRelaunch: boolean;

  disconnectedCallback() {
    searchMapStore.setState({
      selectedActivity: null,
      individualDetail: null,
      searchDoctor: [],
      specialties: [],
    });
    configStore.setState({
      modeView: ModeViewType.LIST
    })
  }
  componentWillLoad() {
    const { selectedActivity, locationFilter, specialtyFilter } = searchMapStore.state
    const { name } = searchMapStore.state.searchFields
    if (!selectedActivity && locationFilter) {
      searchLocationWithParams()
    }
    if (!specialtyFilter && !name && locationFilter && locationFilter.id === NEAR_ME) {
      configStore.setState({
        modeView: ModeViewType.MAP
      })
    }
    this.handleVisibleRelaunchBtn = this.handleVisibleRelaunchBtn.bind(this);
  }
  searchDataCardList;
  searchDataMapElm;

  onItemCardClick = async item => {
    searchMapStore.setState({
      selectedActivity: item,
      individualDetail: null
    });
  };

  @Listen('backFromHcpFullCard')
  backFromHcpFullCardHandler() {
    const { navigatedFromHome } = searchMapStore.state;

    if (navigatedFromHome) {
      searchMapStore.setState({
        navigatedFromHome: false
      });
      this.goBackToHome();
      return;
    }
    this.goBackToList();
  }

  @Listen('onMarkerClick')
  handleOnMarkerClick(e) {
    const breakpoint = uiStore.state.breakpoint;
    const selectedFirstMarkerIdx = searchMapStore.state.specialties.findIndex(item => item.lat === e.detail.latlng.lat && item.lng === e.detail.latlng.lng);
    const isSmall = breakpoint.screenSize === 'mobile';
    const elm = isSmall ? this.searchDataCardList : this.searchDataMapElm
    const doctorCardOffset = getDoctorCardOffset(elm, selectedFirstMarkerIdx, !isSmall);

    animateScrollTo({
      element: elm,
      scrollDirection: isSmall ? 'scrollLeft': 'scrollTop',
      to: doctorCardOffset,
      duration: 1000
    });

    this.selectedMarkerLocation = {
      lat: e.detail.latlng.lat,
      lng: e.detail.latlng.lng
    }
  }

  @Listen('onMapDrag')
  handleVisibleRelaunchBtn(evt) {
    const { selectedActivity, individualDetail } = searchMapStore.state;
    const isShowHCPDetail = individualDetail || selectedActivity;

    if (isShowHCPDetail) {
      return
    }

    if (!this.isShowRelaunchBtn) {
      this.isShowRelaunchBtn = true;
    }

    const target = evt.detail.target; // Map Element
    if (target.getCenter) {
      this.newDragLocation = target.getCenter();
    }
    if (target.getBounds) {
      const bounds = target.getBounds()
      this.newDragBoundingBox = [
        bounds.getSouth(),
        bounds.getNorth(),
        bounds.getWest(),
        bounds.getEast()
      ]
    }
  }

  @Listen('switchViewMode')
  handleOnSwitchViewMode(evt) {
    if (evt.detail === ModeViewType.LIST && !this.isOpenPanel) {
      this.isOpenPanel = true;
    }
  }

  @Listen('moveCurrentLocation')
  handleMoveToCurrentLocation(evt) {
    this.newDragLocation = {
      lat: evt.detail.lat,
      lng: evt.detail.lng
    } as any
    this.handleRelaunchSearch()
  }

  handleRelaunchSearch = async () => {
    if (!this.newDragLocation || this.isLoadingRelaunch) {
      return;
    }

    try {
      this.isLoadingRelaunch = true;
      const result = await getAddressFromGeo(this.newDragLocation.lat, this.newDragLocation.lng);

      if (result) {
        searchMapStore.setSearchFieldValue('address', result.shortDisplayName);
        const params = genSearchLocationParams({
          locationFilter: {
            lat: this.newDragLocation.lat,
            lng: this.newDragLocation.lng,
            boundingbox: result.boundingbox,
            addressDetails: result.addressDetails
          },
          specialtyFilter: searchMapStore.state.specialtyFilter
        })

        if (params.location && this.newDragBoundingBox.length === 4) {
          const { point } = groupPointFromBoundingBox(this.newDragBoundingBox)
          const maxDistanceMeter = getDistance(point.topLeft, point.bottomRight, 1);
          params.location.distanceMeter = maxDistanceMeter
        }

        await searchLocation(params, {
          hasLoading: 'idle',
          isAcceptEmptyData: false // No redirect to no results screen when relaunch is empty
        });
      }
    } catch(err) {
      console.error(err);
    }
    
    this.isLoadingRelaunch = false;
    this.isShowRelaunchBtn = false;
    this.newDragLocation = null;
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
        component: 'hcl-sdk-sort',
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
          <hcl-sdk-button noBorder noBackground icon="arrow" iconColor={getCssColor('--hcl-color-dark')} onClick={() => this.goBackToHome()}>
            <span class="text-small">{t('back_to_home')}</span>
          </hcl-sdk-button>
        </div>
        <div class="search-result__wrapper">
          <strong class="search-result__total">{t('results_label')}: </strong>
          <strong class="search-result__total-value text-primary text-bold">{specialties.length}</strong>
        </div>
        <div class="hidden-desktop hidden-tablet switch-mode">
          <hcl-sdk-switch-view-mode typeOfLabel="disabled" />
        </div>
        <div class="search-filter-wrapper">
          <div class="search-filter">
            <hcl-sdk-icon name="sort" width={15} height={9} onClick={this.onOpenSort} />
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
      loadingActivitiesStatus,
      individualDetail
    } = searchMapStore.state;

    const selectedAddressName = locationFilter?.id === NEAR_ME ? t('near_me') : searchFields.address;
    const isShowHeaderNearmeMobile = (locationFilter?.id === NEAR_ME || searchFields.address === t('near_me')) && searchFields.name === '';

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
      'with-nearme': isShowHeaderNearmeMobile,
    });

    const injectedMapProps = {
      mapHeight: '100%',
      class: mapClass, 
      modeView: modeView, 
      selectedLocationIdx: 0,
      defaultZoom: 15,
      zoomControl: true
    }

    const isShowHCPDetail = individualDetail || selectedActivity;
    const loadingActivities = loadingActivitiesStatus === 'loading';
    const isNoDataAvailable = loadingActivitiesStatus === 'error';
    const isShowNoResults = !loadingActivities && specialties && !specialties.length && !isShowHCPDetail && !isNoDataAvailable;
    const isShowToolbar = {
      mobile: !loadingActivities && isSmall && !selectedActivity && !isNoDataAvailable,
      desktop: !loadingActivities && !isSmall,
    }
    const isShowMapSingle = !isListView && isShowHCPDetail && !isSmall;
    const isShowMapCluster = !isListView && !isShowHCPDetail && specialties && specialties.length !== 0;
    
    const locationsMapSingle = this.getLocationsMapSingle();
    const isShowRelaunchBtn = this.isShowRelaunchBtn && isShowMapCluster;

    const isShowHeaderBlockMobile = !isNoDataAvailable;

    return (
      <Host class={wrapperClass}>
        {(!selectedActivity || !isSmall) &&
          (isSmall ? (
            isShowHeaderBlockMobile && (
              <div class="header-block search-header search-section">
                <hcl-sdk-button
                  class="btn-back"
                  iconWidth={27}
                  iconHeight={27}
                  noBorder
                  noBackground
                  icon="arrow"
                  iconColor={getCssColor('--hcl-color-dark')}
                  onClick={() => this.goBackToHome()}
                ></hcl-sdk-button>
                <div class="header-infos">
                  {isShowHeaderNearmeMobile ? (
                    <div class="search-home-hpc" onClick={this.goToSearch}>
                      <input class="search-input" placeholder="Find Healthcare Professional" />
                      <hcl-sdk-button primary icon="search" class="hclsdk-btn-search-address" />
                    </div>
                  ) : (
                    <Fragment>
                      <strong class="search-result-title">{searchMapStore.state.searchFields.name}</strong>
                      <div class="search-result-address">{selectedAddressName || t('anywhere')}</div>
                    </Fragment>
                  )}
                </div>
              </div>
            )
          ) : (
            <hcl-sdk-search searchText={t('search')} showSwitchMode />
          ))}

        {
          (isShowNoResults || isNoDataAvailable) ? (
            (isShowNoResults && <hcl-sdk-search-no-results />) ||
            (isNoDataAvailable && <hcl-sdk-search-no-data-available />)
          ) : (
            <Fragment>
              {isShowToolbar.mobile && this.renderToolbar(true)}
              <div class={cls('body-block', {
                'body-block--disabled': this.isLoadingRelaunch
              })}>
                <div class={mapWrapperClass} ref={el => (this.searchDataMapElm = el as HTMLInputElement)}>
                  {selectedActivity ? <hcl-sdk-hcp-full-card /> : isShowToolbar.desktop && this.renderToolbar()}
                  {!selectedActivity && (
                    <div class={searchDataClass} ref={el => (this.searchDataCardList = el as HTMLInputElement)}>
                      {!loadingActivities && specialties.map(elm => (
                        <hcl-sdk-doctor-card
                          selected={this.selectedMarkerLocation.lat === elm.lat && this.selectedMarkerLocation.lng === elm.lng} 
                          {...elm}
                          key={elm.id}
                          onClick={() => this.onItemCardClick(elm)}
                          showDistance={elm.distanceNumber > 0}
                        />
                      ))}
                      {loadingActivities && (
                        <div class="search-result__loading">
                          <hcl-sdk-icon name="circular" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div class="toggle-panel">
                  <hcl-sdk-button icon="chevron-arrow" noBackground noBorder iconWidth={20} iconHeight={24} iconColor="black" onClick={this.togglePanel} />
                </div>

                {
                  isShowRelaunchBtn && (
                    <div class={cls('hclsdk-btn-relaunch', {
                      'hclsdk-btn-relaunch--loading': this.isLoadingRelaunch
                    })}>
                      <hcl-sdk-button 
                        icon="refresh" 
                        noBorder 
                        secondary 
                        iconWidth={12} 
                        iconHeight={12} 
                        iconColor="white"
                        onClick={this.handleRelaunchSearch}
                      >
                        {t('relaunch')}
                      </hcl-sdk-button>
                    </div>
                  )
                }

                {
                  isShowMapCluster && (
                    <hcl-sdk-map
                      key="map-cluster"
                      breakpoint={breakpoint}
                      locations={specialties}
                      isShowMeMarker={true}
                      {...injectedMapProps}
                    />
                  )
                }

                {
                  isShowMapSingle && (
                    <hcl-sdk-map 
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
