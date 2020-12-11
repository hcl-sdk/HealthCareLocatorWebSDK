import { Component, Host, h, State, Listen } from '@stencil/core';
import { getCssColor, getDoctorCardOffset } from '../../../utils/helper';
import { getAddressFromGeo } from '../../../core/api/searchGeo';
import { configStore, searchMapStore } from '../../../core/stores';
import { ModeViewType } from '../../../core/stores/ConfigStore';
import animateScrollTo from '../../../utils/animatedScrollTo';
import cls from 'classnames';
import { searchLocation } from '../../../core/api/hcp';
@Component({
  tag: 'onekey-sdk-search-result',
  styleUrl: 'onekey-sdk-search-result.scss',
  shadow: false,
})
export class OnekeySdkSearchResult {
  @State() isListViewMode: boolean = true;
  @State() selectedMarkerIdx: number;
  @State() selectedHCPFullCard: any;
  @State() isOpenPanel: boolean = true;

  componentWillLoad() {
    searchLocation();
  }
  searchDataCardList;

  onItemCardClick = item => {
    this.selectedHCPFullCard = { ...item };
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
    this.selectedHCPFullCard = null;
  };

  togglePanel = () => {
    this.isOpenPanel = !this.isOpenPanel
  }

  onOpenSort = () => {
    configStore.setState({
      modal: {
        title: "Sort",
        component: "onekey-sdk-sort"
      }
    })
  }

  render() {
    if (!searchMapStore.state.search) {
      return null;
    }

    const { specialties } = searchMapStore.state;

    const selectedDoctorName = searchMapStore.state.selectedValues?.name?.label;
    const selectedAddressName = searchMapStore.state.selectedValues?.address?.label;
    const viewPortSize = configStore.state.viewPortSize
    const isSmall = ['xs', 'sm', 'md'].includes(viewPortSize);
    const isTablet = ['lg'].includes(viewPortSize);
    const isDesktop = ['xl'].includes(viewPortSize);
    const isListView = configStore.state.modeView === ModeViewType.LIST;
    const modeView = configStore.state.modeView;
    const searchDataClass = cls('search-data', {
      'list-view': !isSmall || isListView,
    });

    const offsetHeight = isSmall ? configStore.state.viewSDKDimension.height - 110 : configStore.state.viewSDKDimension.height - 82;
    const mapClass = cls('search-map__content', {
      'hidden-xs hidden-sm hidden-md': isSmall && isListView,
      'hidden-lg': isTablet && isListView,
      'hidden-xl': isDesktop && isListView,
    });

    const mapWrapperClass = cls("search-map-wrapper", {
      'hide': !this.isOpenPanel
    })

    const heightResult = isSmall ? '100%' : `${offsetHeight}px`

    return (
      <Host class={`size-${viewPortSize} ${modeView.toLowerCase()}-view-mode`}>
        <div class="search-result" style={{ height: heightResult }}>
          {isSmall ? (
            <div class="search-header search-section">
              <onekey-sdk-router-link url="/search" class="btn-back">
                <onekey-sdk-icon name="arrow" color={getCssColor("--onekeysdk-color-dark")} />
              </onekey-sdk-router-link>
              <div>
                <strong class="search-result-title">{selectedDoctorName}</strong>
                <div class="search-result-address">{selectedAddressName}</div>
              </div>
            </div>
          ) : (
            <onekey-sdk-search searchText="Search" showSwitchMode />
          )}
          {searchMapStore.state.loading ? (
            <onekey-sdk-loading class="hidden-lg hidden-xl" style={{ position: 'relative'}}></onekey-sdk-loading>
          ) : (
            <div class="search-map search-section"  style={{ height: heightResult }}>

                <div class={mapWrapperClass}>
                  {
                  this.selectedHCPFullCard ?
                    <onekey-sdk-hcp-full-card goBack={this.onBackToList} />
                  :
                  <div class="search-toolbar search-section">
                    <div class="hidden-xs hidden-sm hidden-md">
                      <onekey-sdk-icon name="arrow" />
                      <span class="text-small">Back to my last searches</span>
                    </div>
                    <div>
                      <strong class="search-result__total">Results: </strong>
                      <strong class="search-result__total-value text-primary text-bold">{specialties.length}</strong>
                    </div>
                    <div class="hidden-lg hidden-xl switch-mode">
                      <onekey-sdk-switch-view-mode typeOfLabel="disabled"/>
                    </div>
                    <div class="search-filter-wrapper">
                      <div class="search-filter">
                        <onekey-sdk-icon name="sort" onClick={this.onOpenSort}/>
                      </div>
                    </div>
                  </div>
                    }     
                  {
                    !this.selectedHCPFullCard && <div class={searchDataClass} ref={el => (this.searchDataCardList = el as HTMLInputElement)}>
                    {specialties.map((elm, idx) => (
                      <onekey-sdk-doctor-card selected={this.selectedMarkerIdx === idx} {...elm} onClick={() => this.onItemCardClick(elm)} />
                    ))}
                  </div>
                  }

                  <div class="toggle-panel">
                    <onekey-sdk-button icon="chevron-arrow" noBackground noBorder iconColor="black" onClick={this.togglePanel}/>
                  </div>
        
                </div>
              
              
              {((!isListView && !isSmall) || (!isListView && !this.selectedHCPFullCard) )&& (
                <onekey-sdk-map
                  mapHeight={`${offsetHeight}px`}
                  class={mapClass}
                  modeView={modeView}
                  viewPortSize={viewPortSize}
                  locations={specialties}
                  selectedLocationIdx={0}
                  defaultZoom={5}
                />
              )}
            </div>
          )}
        </div>
      </Host>
    );
  }
}
