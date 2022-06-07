import { Component, Host, h, State, Listen, Fragment, Element } from '@stencil/core';
import { HTMLStencilElement } from '@stencil/core/internal';
import { getCssColor, getDoctorCardOffset } from '../../../utils/helper';
import { getAddressFromGeo } from '../../../core/api/searchGeo';
import { configStore, searchMapStore, uiStore, routerStore, featureStore } from '../../../core/stores';
import { ModeViewType } from '../../../core/stores/ConfigStore';
import animateScrollTo from '../../../utils/animatedScrollTo';
import cls from 'classnames';
import { searchLocationWithParams } from '../../../core/api/hcp';
import { LatLng } from 'leaflet';
import { t } from '../../../utils/i18n';
import { getDistance } from 'geolib';
import { groupPointFromBoundingBox } from '../../../core/api/shared';
import * as HCOApis from '../../../core/api/hco';
import * as HCPApis from '../../../core/api/hcp';
import { SEARCH_TARGET } from '../../../core/stores/SearchMapStore';

@Component({
  tag: 'hcl-sdk-search-result',
  styleUrl: 'hcl-sdk-search-result.scss',
  shadow: false,
})
export class HclSdkSearchResult {
  @Element() el: HTMLStencilElement;
  @State() selectedMarkerLocation = { lat: -1, lng: -1 };
  @State() isOpenPanel: boolean = true;
  @State() isShowRelaunchBtn: boolean = false;
  @State() newDragLocation: LatLng;
  @State() newDragBoundingBox: string[]; // [south, north, west, east]
  @State() isLoadingRelaunch: boolean;

  disconnectedCallback() {
    searchMapStore.resetDataSearch({
      isResetHCPDetail: true,
      isResetSearchFields: false,
    });
    configStore.setState({
      modeView: ModeViewType.LIST,
    });
  }
  componentWillLoad() {
    const { navigatedFromHome, selectedActivity, selectedHco } = searchMapStore.state;

    if (!navigatedFromHome && !selectedActivity && !selectedHco) {
      /**
       * No need to fetch activities for two cases:
       *   - Go to search near me from Home Full (Data had already by Map)
       *   - Go to HCP Full Card
       */
      
      if (searchMapStore.searchTarget === SEARCH_TARGET.HCO) {
        HCOApis.searchLocationWithParams();
      } else {
        searchLocationWithParams();
      }
    }

    if (searchMapStore.isSearchNearMe) {
      configStore.setState({
        modeView: ModeViewType.MAP,
      });
    }

    this.handleVisibleRelaunchBtn = this.handleVisibleRelaunchBtn.bind(this);
    searchMapStore.storeInstance.onChange('sortValues', this.handleObserveSortValuesChange);
  }
  searchDataCardList;
  searchDataMapElm;

  handleObserveSortValuesChange() {
    configStore.setState({
      modal: undefined,
    });
  }

  onItemCardClick = async (item, type: SEARCH_TARGET = SEARCH_TARGET.HCP) => {
    /**
     * There are two ways to go HCP Full Card screen
     *  - Home Full -> Click on Map (Near Me Search) -> List Result -> Click on Item Card -> HCP Full Card
     *  - Home Full -> Click on Last HCP History Search Item -> HCP Full Card
     */
    if (type === SEARCH_TARGET.HCO) {
      searchMapStore.setState({
        selectedHco: item,
        hcoDetail: null,
        navigatedFromHome: false,
      });
    } else {
      searchMapStore.setState({
        selectedActivity: item,
        individualDetail: null,
        navigatedFromHome: false,
      });
    }
  };

  backFromHcpFullCardHandler(_e: CustomEvent<MouseEvent>) {
    const { navigatedFromHome } = searchMapStore.state;
    if (navigatedFromHome) {
      searchMapStore.setState({
        navigatedFromHome: false,
      });
      this.goBackToHome();
    } else {
      if (searchMapStore.state.navigateFromHcoFullCard) {
        this.goBackToHcoFullCard();
      } else {
        this.goBackToList();
      }
    }
  }

  goBackToHcoFullCard() {
    searchMapStore.setState({
      selectedActivity: null,
      individualDetail: null,
      navigateFromHcoFullCard: false
    })
  }

  handleOnMarkerClick(e, type: SEARCH_TARGET) {
    const breakpoint = uiStore.state.breakpoint;
    
    let selectedFirstMarkerIdx = 0
    if (type === SEARCH_TARGET.HCO) {
      selectedFirstMarkerIdx = searchMapStore.state.hcos.findIndex(item => item.lat === e.detail.latlng.lat && item.lng === e.detail.latlng.lng);
    } else {
      selectedFirstMarkerIdx = searchMapStore.state.specialties.findIndex(item => item.lat === e.detail.latlng.lat && item.lng === e.detail.latlng.lng);
    }

    const isSmall = breakpoint.screenSize === 'mobile';
    const elm = isSmall ? this.searchDataCardList : this.searchDataMapElm;
    const doctorCardOffset = getDoctorCardOffset(elm, selectedFirstMarkerIdx, !isSmall, false, this.el);

    animateScrollTo({
      element: elm,
      scrollDirection: isSmall ? 'scrollLeft' : 'scrollTop',
      to: doctorCardOffset,
      duration: 1000,
    });

    this.selectedMarkerLocation = {
      lat: e.detail.latlng.lat,
      lng: e.detail.latlng.lng,
    };
  }

  @Listen('onMapDrag')
  handleVisibleRelaunchBtn(evt) {
    const { selectedActivity, individualDetail } = searchMapStore.state;
    const isShowHCPDetail = individualDetail || selectedActivity;

    if (isShowHCPDetail) {
      return;
    }

    if (!this.isShowRelaunchBtn) {
      this.isShowRelaunchBtn = true;
    }

    const target = evt.detail.target; // Map Element
    if (target.getCenter) {
      this.newDragLocation = target.getCenter();
    }
    if (target.getBounds) {
      const bounds = target.getBounds();
      this.newDragBoundingBox = [bounds.getSouth(), bounds.getNorth(), bounds.getWest(), bounds.getEast()];
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
      lng: evt.detail.lng,
    } as any;
    this.handleRelaunchSearch();
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
        const apis = searchMapStore.searchTarget === SEARCH_TARGET.HCO ? HCOApis : HCPApis
        const params = await apis.genSearchLocationParams({
          locationFilter: {
            lat: this.newDragLocation.lat,
            lng: this.newDragLocation.lng,
            boundingbox: result.boundingbox,
            addressDetails: result.addressDetails,
          },
          specialtyFilter: searchMapStore.state.specialtyFilter,
          medicalTermsFilter: searchMapStore.state.medicalTermsFilter,
          searchFields: searchMapStore.state.searchFields,
        });

        if (params.location && this.newDragBoundingBox.length === 4) {
          const { point } = groupPointFromBoundingBox(this.newDragBoundingBox);
          const maxDistanceMeter = getDistance(point.topLeft, point.bottomRight, 1);
          params.location.distanceMeter = maxDistanceMeter;
        }

        await apis.searchLocation(params, {
          hasLoading: 'idle',
          isAllowDisplayMapEmpty: true, // No redirect to no results screen when relaunch is empty
        });
      }
    } catch (err) {
      console.error(err);
    }

    this.isLoadingRelaunch = false;
    this.isShowRelaunchBtn = false;
    this.newDragLocation = null;
  };

  goBackToList = () => {
    searchMapStore.setState({
      selectedActivity: null,
      individualDetail: null,
      selectedHco: null,
      hcoDetail: null,
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
    const specialtiesRecommended = specialties.filter(s => s.reviewsAvailable || s.diseasesAvailable);
    const isShowRecommend = specialtiesRecommended.length > 0;
    const countRecommendStr = specialtiesRecommended.length < 10 ? `0${specialtiesRecommended.length}` : specialtiesRecommended.length;
    const className = cls('search-toolbar', {
      'hco-search': configStore.state.enableHcoSearch,
      'header-block': isSmall,
      'search-toolbar--with-recommend': isShowRecommend,
    });
    const isListView = configStore.state.modeView === ModeViewType.LIST;

    const totalResults = searchMapStore.searchTarget === SEARCH_TARGET.HCO ? searchMapStore.state.hcos?.length : searchMapStore.state.specialties?.length;

    return (
      <div class={className}>
        <div class={'search-toolbar__actions'}>
          <div class="search-back-large hidden-mobile">
            <hcl-sdk-button noBorder noBackground icon="back" iconColor={getCssColor('--hcl-color-dark')} onClick={() => this.goBackToHome()}>
              <span class="text-small">{t('back_to_home')}</span>
            </hcl-sdk-button>
          </div>
          {(isListView && !isSmall || searchMapStore.searchTarget === SEARCH_TARGET.HCO) && (
            <div class={cls('search-result-summary hco-search', {
              'search-result-summary--list-view': isListView,
              'search-result-summary--no-border-top': searchMapStore.searchTarget === SEARCH_TARGET.HCO
            })}>
              <div class="search-result__wrapper">
                <strong class="search-result__total">{t('total_results')}: </strong>
                <strong class="search-result__total-value text-bold">{totalResults}</strong>
              </div>
              {featureStore.isPatientRecommendationEnabled && isShowRecommend && !isSmall && (
                <div class="search-recommend__wrapper">
                  <img class="search-recommend__img" src="https://www.mapatho.com/favicon.ico" alt="" />
                  <strong class="search-result__total">Patient's&nbsp;Recommendation:&nbsp;</strong>
                  <strong class="search-recommend__total-value text-bold">{countRecommendStr}</strong>
                </div>
              )}
            </div>
          )}
          <div class={cls("hidden-desktop hidden-tablet switch-mode", {
            'switch-mode--expand-right': searchMapStore.searchTarget === SEARCH_TARGET.HCO
          })}>
            <hcl-sdk-switch-view-mode typeOfLabel="disabled" />
          </div>
          <div class={cls("search-filter-wrapper", {
            'search-filter-wrapper--expand-right': searchMapStore.searchTarget !== SEARCH_TARGET.HCO && isSmall
          })}>
            <div class="search-filter">
              <hcl-sdk-icon name="sort" width={15} height={9} onClick={this.onOpenSort} />
            </div>
          </div>
        </div>
        {!isListView && searchMapStore.searchTarget !== SEARCH_TARGET.HCO && (
          <div class="search-result-summary">
            <div class="search-result__wrapper">
              <strong class="search-result__total">{t('total_results')}: </strong>
              <strong class="search-result__total-value text-bold">{totalResults}</strong>
            </div>
            {featureStore.isPatientRecommendationEnabled && isShowRecommend && !isSmall && (
              <div class="search-recommend__wrapper">
                <strong class="search-result__total">Patient's&nbsp;Recommendation:&nbsp;</strong>
                <strong class="search-recommend__total-value text-bold">{countRecommendStr}</strong>
                <img class="search-recommend__img" src="https://www.mapatho.com/favicon.ico" alt="" />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  getLocationsMapSingle() {
    const { selectedActivity, individualDetail } = searchMapStore.state;
    if (individualDetail) {
      return [{ lat: individualDetail.lat, lng: individualDetail.lng }];
    }
    if (selectedActivity) {
      return [{ lat: selectedActivity.lat, lng: selectedActivity.lng }];
    }
    return null;
  }

  getLocationMapSingleHco() {
    const { selectedHco, hcoDetail } = searchMapStore.state;
    if (hcoDetail) {
      return [{ lat: hcoDetail.lat, lng: hcoDetail.lng }];
    }
    if (selectedHco) {
      return [{ lat: selectedHco.lat, lng: selectedHco.lng }];
    }
    return null;
  }

  renderHcoResults() {
    const { hcoDetail, selectedHco, isAllowDisplayMapEmpty, selectedActivity, individualDetail } = searchMapStore.state;
    // show HCP when click on individual from hco full card
    const isShowHCPDetail = individualDetail || selectedActivity;

    const breakpoint = uiStore.state.breakpoint;
    const isSmall = breakpoint.screenSize === 'mobile';
    const isListView = configStore.state.modeView === ModeViewType.LIST;

    const searchDataClass = cls('search-data', {
      'list-view': !isSmall || isListView,
    });

    const mapWrapperClass = cls('search-map-wrapper', {
      hide: !this.isOpenPanel,
    });

    const activitiesStatus = searchMapStore.state.loadingHcosStatus;

    const isLoadingHcos = activitiesStatus === 'loading'
    const hcos = searchMapStore.state.hcos;

    const isShowHCODetail = hcoDetail || selectedHco;
    const isNoDataAvailable = activitiesStatus === 'unauthorized';

    // show no result if hco null or hco length empty
    const isShowNoResults = !isAllowDisplayMapEmpty && !isLoadingHcos && (!hcos || !hcos.length) && !isShowHCODetail && !isNoDataAvailable;

    const isShowToolbar = {
      mobile: !isLoadingHcos && isSmall && !isNoDataAvailable && !selectedHco,
      desktop: !isLoadingHcos && !isSmall,
    };

    const isShowMapSingle = !isListView && isShowHCODetail && !isSmall;
    const isShowMapCluster = isAllowDisplayMapEmpty || (!isListView && !isShowHCODetail && hcos && hcos.length !== 0);

    const locationsMapSingle = this.getLocationMapSingleHco();
    const isShowRelaunchBtn = this.isShowRelaunchBtn && isShowMapCluster;

    const modeView = configStore.state.modeView;
    const mapClass = cls('search-map__content', {
      'search-map__empty': isAllowDisplayMapEmpty,
    });

    const injectedMapProps = {
      mapHeight: '100%',
      class: mapClass,
      modeView: modeView,
      selectedLocationIdx: 0,
      defaultZoom: 15,
      zoomControl: true,
    };

    return isShowNoResults || isNoDataAvailable ? (
      (isShowNoResults && <hcl-sdk-search-no-results />) || (isNoDataAvailable && <hcl-sdk-search-no-data-available />)
    ) : (
      <Fragment>
        {isShowToolbar.mobile && this.renderToolbar(true)}
        <div
          class={cls('body-block', {
            'body-block--disabled': this.isLoadingRelaunch,
          })}
        >
          <div class={mapWrapperClass} ref={el => (this.searchDataMapElm = el as HTMLInputElement)}>
            {/* Show toolbar when not at full card */}
            {!isShowHCPDetail && !isShowHCODetail && isShowToolbar.desktop && this.renderToolbar()}
            {/* Show hco full card when have hco detail and no hcp detail */}
            {!isShowHCPDetail && isShowHCODetail ? <hcl-sdk-hco-full-card onBackFromFullCard={e => this.backFromHcpFullCardHandler(e)} /> : null}
            {/* Show hcp detail when have have hcp detail */}
            {isShowHCPDetail && isShowHCODetail ? <hcl-sdk-hcp-full-card onBackFromFullCard={e => this.backFromHcpFullCardHandler(e)} /> : null}
            {!isShowHCODetail && (
              <div class={searchDataClass} ref={el => (this.searchDataCardList = el as HTMLInputElement)}>
                {!isLoadingHcos &&
                  hcos.map(elm => (
                    <hcl-sdk-hco-card
                      selected={this.selectedMarkerLocation.lat === elm.lat && this.selectedMarkerLocation.lng === elm.lng}
                      {...elm}
                      key={elm.id}
                      onClick={() => this.onItemCardClick(elm, SEARCH_TARGET.HCO)}
                      showDistance={elm.distanceNumber > 0}
                    />
                  ))}
                <div class={'search-result__footnote'}>
                  <hcl-sdk-button round icon="calendar-clock-outline" noBackground noBorder />
                  {t('appointment_available')}
                </div>
                {isLoadingHcos && (
                  <div class="search-result__loading">
                    <hcl-sdk-icon name="circular" />
                  </div>
                )}
              </div>
            )}
          </div>
          <div class="toggle-panel">
            <hcl-sdk-button icon="arrow_right" noBackground noBorder iconWidth={20} iconHeight={24} iconColor={getCssColor('--hcl-color-dark')} onClick={this.togglePanel} />
          </div>
          {isShowRelaunchBtn && (
            <div
              class={cls('hclsdk-btn-relaunch', {
                'hclsdk-btn-relaunch--loading': this.isLoadingRelaunch,
              })}
            >
              <hcl-sdk-button icon="refresh" noBorder secondary iconWidth={12} iconHeight={12} iconColor="white" onClick={this.handleRelaunchSearch}>
                {t('relaunch')}
              </hcl-sdk-button>
            </div>
          )}

          {isLoadingHcos && (
            <div class="search-result__loading">
              <hcl-sdk-icon name="circular" />
            </div>
          )}

          {isShowMapCluster && (
            <hcl-sdk-map
              key="map-cluster"
              breakpoint={breakpoint}
              locations={hcos}
              onOnMarkerClick={m => this.handleOnMarkerClick(m, SEARCH_TARGET.HCO)}
              isShowMeMarker={true}
              {...injectedMapProps}
            />
          )}
          {isShowMapSingle && <hcl-sdk-map key="map-single" locations={locationsMapSingle} noCurrentLocation {...injectedMapProps} />}
        </div>
      </Fragment>
    );
  }

  renderHcpResults() {
    const { selectedActivity, individualDetail, isAllowDisplayMapEmpty } = searchMapStore.state;

    const breakpoint = uiStore.state.breakpoint;
    const isSmall = breakpoint.screenSize === 'mobile';
    const isListView = configStore.state.modeView === ModeViewType.LIST;

    const searchDataClass = cls('search-data', {
      'list-view': !isSmall || isListView,
    });

    const mapWrapperClass = cls('search-map-wrapper', {
      hide: !this.isOpenPanel,
    });

    const modeView = configStore.state.modeView;

    const mapClass = cls('search-map__content', {
      'search-map__empty': isAllowDisplayMapEmpty,
    });

    const injectedMapProps = {
      mapHeight: '100%',
      class: mapClass,
      modeView: modeView,
      selectedLocationIdx: 0,
      defaultZoom: 15,
      zoomControl: true,
    };

    const isShowHCPDetail = individualDetail || selectedActivity;

    const { isLoading: loadingActivities, status: activitiesStatus, data: activities } = searchMapStore.activities;
    const isNoDataAvailable = activitiesStatus === 'unauthorized';

    const isShowNoResults = !isAllowDisplayMapEmpty && !loadingActivities && activities && !activities.length && !isShowHCPDetail && !isNoDataAvailable;
    const isShowToolbar = {
      mobile: !loadingActivities && isSmall && !selectedActivity && !isNoDataAvailable,
      desktop: !loadingActivities && !isSmall,
    };
    const isShowMapSingle = !isListView && isShowHCPDetail && !isSmall;
    const isShowMapCluster = isAllowDisplayMapEmpty || (!isListView && !isShowHCPDetail && activities && activities.length !== 0);

    const locationsMapSingle = this.getLocationsMapSingle();
    const isShowRelaunchBtn = this.isShowRelaunchBtn && isShowMapCluster;

    return isShowNoResults || isNoDataAvailable ? (
      (isShowNoResults && <hcl-sdk-search-no-results />) || (isNoDataAvailable && <hcl-sdk-search-no-data-available />)
    ) : (
      <Fragment>
        {isShowToolbar.mobile && this.renderToolbar(true)}
        <div
          class={cls('body-block', {
            'body-block--disabled': this.isLoadingRelaunch,
          })}
        >
          <div class={mapWrapperClass} ref={el => (this.searchDataMapElm = el as HTMLInputElement)}>
            {isShowHCPDetail ? <hcl-sdk-hcp-full-card onBackFromFullCard={e => this.backFromHcpFullCardHandler(e)} /> : isShowToolbar.desktop && this.renderToolbar()}
            {!isShowHCPDetail && (
              <div class={searchDataClass} ref={el => (this.searchDataCardList = el as HTMLInputElement)}>
                {!loadingActivities &&
                  activities.map(elm => (
                    <hcl-sdk-doctor-card
                      selected={this.selectedMarkerLocation.lat === elm.lat && this.selectedMarkerLocation.lng === elm.lng}
                      {...elm}
                      key={elm.id}
                      onClick={() => this.onItemCardClick(elm)}
                      showDistance={elm.distanceNumber > 0}
                    />
                  ))}
                <div class={'search-result__footnote'}>
                  <hcl-sdk-button round icon="calendar-clock-outline" noBackground noBorder />
                  {t('appointment_available')}
                </div>
                {loadingActivities && (
                  <div class="search-result__loading">
                    <hcl-sdk-icon name="circular" />
                  </div>
                )}
              </div>
            )}
          </div>
          <div class="toggle-panel">
            <hcl-sdk-button icon="arrow_right" noBackground noBorder iconWidth={20} iconHeight={24} iconColor={getCssColor('--hcl-color-dark')} onClick={this.togglePanel} />
          </div>

          {isShowRelaunchBtn && (
            <div
              class={cls('hclsdk-btn-relaunch', {
                'hclsdk-btn-relaunch--loading': this.isLoadingRelaunch,
              })}
            >
              <hcl-sdk-button icon="refresh" noBorder secondary iconWidth={12} iconHeight={12} iconColor="white" onClick={this.handleRelaunchSearch}>
                {t('relaunch')}
              </hcl-sdk-button>
            </div>
          )}

          {loadingActivities && (
            <div class="search-result__loading">
              <hcl-sdk-icon name="circular" />
            </div>
          )}

          {isShowMapCluster && (
            <hcl-sdk-map
              key="map-cluster"
              breakpoint={breakpoint}
              onOnMarkerClick={m => this.handleOnMarkerClick(m, SEARCH_TARGET.HCP)}
              locations={activities}
              isShowMeMarker={true}
              {...injectedMapProps}
            />
          )}

          {isShowMapSingle && <hcl-sdk-map key="map-single" locations={locationsMapSingle} noCurrentLocation {...injectedMapProps} />}
        </div>
      </Fragment>
    );
  }

  shouldShowHeaderBlockMobile() {
    if (searchMapStore.searchTarget === SEARCH_TARGET.HCP) {
      return searchMapStore.state.loadingActivitiesStatus !== 'unauthorized';
    }

    if (searchMapStore.searchTarget === SEARCH_TARGET.HCO) {
      return searchMapStore.state.loadingHcosStatus !== 'unauthorized';
    }
  }

  render() {
    if (!searchMapStore.state.search) {
      return null;
    }

    const { selectedActivity, selectedHco, searchFields } = searchMapStore.state;

    const selectedAddressName = searchMapStore.isSearchNearMe ? t('near_me') : searchFields.address;

    const breakpoint = uiStore.state.breakpoint;
    const isSmall = breakpoint.screenSize === 'mobile';

    const isShowHeaderNearmeMobile = searchMapStore.isSearchNearMe;
    const wrapperClass = cls('search-result main-contain', `${configStore.state.modeView.toLowerCase()}-view-mode`, {
      'hcp-details': !!selectedActivity,
      'with-nearme': isShowHeaderNearmeMobile,
    });

    const isShowHeaderBlockMobile = this.shouldShowHeaderBlockMobile();

    return (
      <Host class={wrapperClass}>
        {(!(selectedActivity || selectedHco) || !isSmall) &&
          (isSmall ? (
            isShowHeaderBlockMobile && (
              <div class="header-block search-header search-section">
                <hcl-sdk-button
                  class="btn-back"
                  iconWidth={27}
                  iconHeight={27}
                  noBorder
                  noBackground
                  icon="back"
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
                      <strong class="search-result-title">{searchMapStore.getSearchLabel(true)}</strong>
                      <div class="search-result-address">{selectedAddressName || t('anywhere')}</div>
                    </Fragment>
                  )}
                </div>
              </div>
            )
          ) : (
            <hcl-sdk-search isSearchResult />
          ))}
        {searchMapStore.state.searchTarget === SEARCH_TARGET.HCO ? this.renderHcoResults() : this.renderHcpResults()}
      </Host>
    );
  }
}
