import { Component, Host, h, State, Listen } from '@stencil/core';
import { getDoctorCardOffset } from 'onekey-sdk-core-ui/src/utils/helper';
import { getHCPNearMe } from '../../../core/api/hcp';
import { getAddressFromGeo } from '../../../core/api/searchGeo';
import { configStore, routerStore, searchMapStore } from '../../../core/stores';
import animateScrollTo from '../../../utils/animatedScrollTo';
import cls from 'classnames';
@Component({
  tag: 'onekey-sdk-search-result',
  styleUrl: 'onekey-sdk-search-result.scss',
  shadow: false,
})
export class OnekeySdkSearchResult {
  @State() isListViewMode: boolean = true;
  @State() selectedMarkerIdx: number;

  componentWillLoad() {
    getHCPNearMe();
  }
  searchDataCardList;

  onItemCardClick = () => {
    routerStore.push('/hcp-full-card');
  };

  @Listen('markerClick')
  onMarkerClick(e) {
    const selectedMarkerIdx = searchMapStore.state.hcpNearMe.findIndex(item => item.lat === e.detail.latlng.lat && item.lng === e.detail.latlng.lng);
    const doctorCardOffset = getDoctorCardOffset(this.searchDataCardList, selectedMarkerIdx);

    animateScrollTo(this.searchDataCardList, 'scrollLeft', doctorCardOffset, 1000);
    this.selectedMarkerIdx = selectedMarkerIdx;
  }

  @Listen('setCurrentLocation')
  setCurrentLocation(e) {
    getAddressFromGeo(e.detail.lat, e.detail.lng);
  }

  @Listen('switchViewMode')
  onSwitchViewMode(e) {
    if (e.detail === 'LIST') {
      this.isListViewMode = true;
    } else {
      this.isListViewMode = false;
    }
  }

  render() {
    if (!searchMapStore.state.search) {
      return null;
    }

    const { hcpNearMe, currentLocation, search } = searchMapStore.state;
    const address = currentLocation?.display_name || search.selectedItem.label;
    const isSmall = ['xs', "sm", "md"].includes(configStore.state.viewPortSize)

    const searchDataClass = cls('search-data', {
      'list-view': !isSmall || this.isListViewMode,
    });

    const offsetHeight = configStore.state.viewSDKDimension.height;

    return (
      <Host class={`size-${configStore.state.viewPortSize}`}>
        <div class="search-result" style={{ height: '700px' }}>
          {['sm', 'md'].includes(configStore.state.viewPortSize) ? (
            <div class="search-header search-section">
              <div>
                <onekey-sdk-router-link url="/" class="btn-back">
                  <ion-icon name="arrow-back-outline"></ion-icon>
                </onekey-sdk-router-link>
              </div>
              <div>
                <strong class="search-result-title">{search.name}</strong>
                <div class="search-result-address">{address}</div>
              </div>
            </div>
          ) : (
            <onekey-sdk-search searchText="Search" />
          )}

          {searchMapStore.state.loading 
            ? <onekey-sdk-loading></onekey-sdk-loading>
            : (
              <div class="search-map search-section" style={{ height: `${offsetHeight - 82}px` }}>
                <div class="search-map-wrapper">
                <div class="search-toolbar search-section">
                  <div class="hidden-xs hidden-sm hidden-md">
                    <onekey-sdk-icon name="arrow" />
                    <span class="text-small">Back to my last searches</span>
                  </div>
                  <div>
                    <strong>Results: </strong>
                    <strong class="text-primary text-bold">{hcpNearMe.length}</strong>
                  </div>
                  <div class="hidden-lg hidden-xl">
                    <onekey-sdk-switch-view-mode />
                  </div>
                  <div class="search-filter">
                    <ion-icon name="filter-circle-sharp"></ion-icon>
                  </div>
                </div>
                  <div class={searchDataClass} ref={el => (this.searchDataCardList = el as HTMLInputElement)}>
                    {hcpNearMe.map((elm, idx) => (
                      <onekey-sdk-doctor-card selected={this.selectedMarkerIdx === idx} {...elm} onClick={this.onItemCardClick} />
                    ))}
                  </div>
                </div>
                

                {!!hcpNearMe.length && (!isSmall || !this.isListViewMode) && <onekey-sdk-map mapHeight={`${offsetHeight - 82}px`} class="search-map__content" locations={hcpNearMe} selectedLocationIdx={0} defaultZoom={5} zoomControl={isSmall} />}
              </div>
            )
          }

          
          
        </div>
      </Host>
    );
  }
}
