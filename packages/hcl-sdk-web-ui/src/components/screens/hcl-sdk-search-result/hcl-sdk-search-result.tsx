import { Component, Host, h, State, Listen, Fragment } from '@stencil/core';
import { getCssColor, getDoctorCardOffset } from '../../../utils/helper';
import { getAddressFromGeo } from '../../../core/api/searchGeo';
import { configStore, searchMapStore, uiStore, routerStore } from '../../../core/stores';
import { ModeViewType } from '../../../core/stores/ConfigStore';
import animateScrollTo from '../../../utils/animatedScrollTo';
import cls from 'classnames';
import sortBy from 'lodash.sortby';
import { genSearchLocationParams, groupPointFromBoundingBox, searchLocation, searchLocationWithParams } from '../../../core/api/hcp';
import { NEAR_ME } from '../../../core/constants';
import { LatLng } from 'leaflet';
import { t } from '../../../utils/i18n';
import { getDistance } from 'geolib';
import { SortValue } from '../../../core/stores/SearchMapStore';

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
    searchMapStore.resetDataSearch({
      isResetHCPDetail: true,
      isResetSearchFields: false,
    })
    configStore.setState({
      modeView: ModeViewType.LIST
    })
  }
  componentWillLoad() {
    const { navigatedFromHome, selectedActivity } = searchMapStore.state

    if (!navigatedFromHome && !selectedActivity) {
      /**
       * No need to fetch activities for two cases:
       *   - Go to search near me from Home Full (Data had already by Map)
       *   - Go to HCP Full Card
       */
      searchLocationWithParams()
    }

    if (searchMapStore.isSearchNearMe) {
      configStore.setState({
        modeView: ModeViewType.MAP
      })
    }

    this.handleVisibleRelaunchBtn = this.handleVisibleRelaunchBtn.bind(this);
    this.handleObserveSortValuesChange(searchMapStore.state.sortValues)
    searchMapStore.storeInstance.onChange('sortValues', this.handleObserveSortValuesChange)
  }
  searchDataCardList;
  searchDataMapElm;

  handleObserveSortValuesChange(sortValues: SortValue) {
    const { specialtiesRaw: specialties } = searchMapStore.state;

    const sortByField = Object.keys(sortValues).filter(elm => sortValues[elm]);

    // Reorder results based on new sort value
    searchMapStore.setState({
      specialties: sortBy(specialties, sortByField),
    });

    configStore.setState({
      modal: undefined,
    });
  }

  onItemCardClick = async item => {
    /**
     * There are two ways to go HCP Full Card screen
     *  - Home Full -> Click on Map (Near Me Search) -> List Result -> Click on Item Card -> HCP Full Card
     *  - Home Full -> Click on Last HCP History Search Item -> HCP Full Card
     */
    searchMapStore.setState({
      selectedActivity: item,
      individualDetail: null,
      navigatedFromHome: false
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
        const params = await genSearchLocationParams({
          locationFilter: {
            lat: this.newDragLocation.lat,
            lng: this.newDragLocation.lng,
            boundingbox: result.boundingbox,
            addressDetails: result.addressDetails
          },
          specialtyFilter: searchMapStore.state.specialtyFilter,
          medicalTermsFilter: searchMapStore.state.medicalTermsFilter,
          searchFields: searchMapStore.state.searchFields
        })

        if (params.location && this.newDragBoundingBox.length === 4) {
          const { point } = groupPointFromBoundingBox(this.newDragBoundingBox)
          const maxDistanceMeter = getDistance(point.topLeft, point.bottomRight, 1);
          params.location.distanceMeter = maxDistanceMeter
        }

        await searchLocation(params, {
          hasLoading: 'idle',
          isAllowDisplayMapEmpty: true // No redirect to no results screen when relaunch is empty
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
          <hcl-sdk-button noBorder noBackground icon="back" iconColor={getCssColor('--hcl-color-dark')} onClick={() => this.goBackToHome()}>
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
      individualDetail,
      isAllowDisplayMapEmpty
    } = searchMapStore.state;

    const selectedAddressName = locationFilter?.id === NEAR_ME ? t('near_me') : searchFields.address;
    const isShowHeaderNearmeMobile = (locationFilter?.id === NEAR_ME || searchFields.address === t('near_me')) && !searchFields.specialtyName && !searchFields.medicalTerm

    const breakpoint = uiStore.state.breakpoint;
    const isSmall = breakpoint.screenSize === 'mobile';
    const isListView = configStore.state.modeView === ModeViewType.LIST;
    const modeView = configStore.state.modeView;
    const searchDataClass = cls('search-data', {
      'list-view': !isSmall || isListView,
    });

    const mapClass = cls('search-map__content', {
      'search-map__empty': isAllowDisplayMapEmpty
    });

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
    const isNoDataAvailable = loadingActivitiesStatus ===  'unauthorized';
    const isShowNoResults = !isAllowDisplayMapEmpty && !loadingActivities && specialties && !specialties.length && !isShowHCPDetail && !isNoDataAvailable;
    const isShowToolbar = {
      mobile: !loadingActivities && isSmall && !selectedActivity && !isNoDataAvailable,
      desktop: !loadingActivities && !isSmall,
    }
    const isShowMapSingle = !isListView && isShowHCPDetail && !isSmall;
    const isShowMapCluster = isAllowDisplayMapEmpty || (!isListView && !isShowHCPDetail && specialties && specialties.length !== 0);

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
                  {isShowHCPDetail ? <hcl-sdk-hcp-full-card /> : isShowToolbar.desktop && this.renderToolbar()}
                  {!isShowHCPDetail && (
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
                  <hcl-sdk-button icon="arrow-right" noBackground noBorder iconWidth={20} iconHeight={24} iconColor="black" onClick={this.togglePanel} />
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
