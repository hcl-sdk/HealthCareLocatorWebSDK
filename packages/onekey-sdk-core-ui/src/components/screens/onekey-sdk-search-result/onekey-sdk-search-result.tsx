import { Component, Host, h, State, Listen } from '@stencil/core';
import { getContainerHeightWidthOffset, getDoctorCardOffset } from 'onekey-sdk-core-ui/src/utils/helper';
import { getHCPNearMe } from '../../../core/api/hcp';
import { getAddressFromGeo } from '../../../core/api/searchGeo';
import { routerStore, searchMapStore } from '../../../core/stores';
import animateScrollTo from '../../../utils/animatedScrollTo'
import cls from 'classnames'
@Component({
  tag: 'onekey-sdk-search-result',
  styleUrl: 'onekey-sdk-search-result.scss',
  shadow: false,
})
export class OnekeySdkSearchResult {
  @State() isListViewMode: boolean  = true;
  @State() selectedMarkerIdx: number;

  componentWillLoad() {
    getHCPNearMe();
  }
  searchDataCardList;

  onItemCardClick = () => {
    routerStore.push("/hcp-full-card")
  };

  @Listen('markerClick')
  onMarkerClick(e) {
    const selectedMarkerIdx = searchMapStore.state.hcpNearMe.findIndex(item => item.lat === e.detail.latlng.lat && item.lng === e.detail.latlng.lng);
    const doctorCardOffset = getDoctorCardOffset(this.searchDataCardList, selectedMarkerIdx)

    animateScrollTo(this.searchDataCardList, 'scrollLeft', doctorCardOffset, 1000)
    this.selectedMarkerIdx = selectedMarkerIdx
  };
  
  @Listen('setCurrentLocation')
  setCurrentLocation(e) {
    getAddressFromGeo(e.detail.lat, e.detail.lng)
  }

  @Listen('switchViewMode')
  onSwitchViewMode(e) {
    if(e.detail === 'LIST') {
      this.isListViewMode = true
    } else {
      this.isListViewMode = false
    }
  }

  render() {
    if (!searchMapStore.state.search) {
      return null;
    }

    const { hcpNearMe, currentLocation, search } = searchMapStore.state;
    const address = currentLocation?.display_name || search.selectedItem.label

    const searchDataClass = cls('search-data', {
      'list-view': this.isListViewMode
    })

    const { offsetHeight } = getContainerHeightWidthOffset()

    return (
      <Host>
        {searchMapStore.state.loading && <onekey-sdk-loading></onekey-sdk-loading>}
        <div class="search-result" style={{ height: '700px' }}>
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
          <div class="search-toolbar search-section">
            <div>
              <strong>Results: </strong>
              <strong class="text-primary text-bold">{hcpNearMe.length}</strong>
            </div>
            <div>
              <onekey-sdk-switch-view-mode />
            </div>
            <div class="search-filter"><ion-icon name="filter-circle-sharp"></ion-icon></div>
          </div>
          <div class="search-map search-section" style={{ height: `${offsetHeight - 800}px` }}>
            <div class={searchDataClass} ref={el => this.searchDataCardList = el as HTMLInputElement}>
              {hcpNearMe.map((elm, idx) => (
                <onekey-sdk-doctor-card selected={this.selectedMarkerIdx === idx} {...elm} onClick={this.onItemCardClick} />
              ))}
            </div>

            {!!hcpNearMe.length && !this.isListViewMode && (
              <onekey-sdk-map
                class="search-map__content"
                locations={hcpNearMe}
                selectedLocationIdx={0}
                defaultZoom={5}
              />
            )}
          </div>
        </div>
      </Host>
    );
  }
}
