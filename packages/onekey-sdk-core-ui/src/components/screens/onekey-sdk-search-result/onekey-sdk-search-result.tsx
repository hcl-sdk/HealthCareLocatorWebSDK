import { Component, Host, h, State, Listen } from '@stencil/core';
import { getHCPNearMe } from '../../../core/api/hcp';
import { getAddressFromGeo } from '../../../core/api/searchGeo';
import { configStore, searchMapStore } from '../../../core/stores';

@Component({
  tag: 'onekey-sdk-search-result',
  styleUrl: 'onekey-sdk-search-result.scss',
  shadow: false,
})
export class OnekeySdkSearchResult {
  @State() selectedMarkerIdx: number;

  componentWillLoad() {
    getHCPNearMe();
  }
  searchDataCardList;

  onItemCardClick = () => {};

  @Listen('markerClick')
  onMarkerClick(e) {
    const selectedMarkerIdx = searchMapStore.state.hcpNearMe.findIndex(item => item.lat === e.detail.latlng.lat && item.lng === e.detail.latlng.lng);
    this.searchDataCardList.scrollLeft = 300*selectedMarkerIdx;
    this.selectedMarkerIdx = selectedMarkerIdx
  };

  @Listen('setCurrentLocation')
  setCurrentLocation(e) {
    getAddressFromGeo(e.detail.lat, e.detail.lng)
  }

  render() {
    if (!searchMapStore.state.search) {
      return null;
    }

    const { hcpNearMe, currentLocation, search } = searchMapStore.state;
    const address = currentLocation?.display_name || search.selectedItem.label

    return (
      <Host>
        {searchMapStore.state.loading && <onekey-sdk-loading></onekey-sdk-loading>}
        <div class="search-result" style={{ height: configStore.state.appHeight }}>
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
          <div class="search-map search-section">
            <div class="search-data" ref={el => this.searchDataCardList = el as HTMLInputElement}>
              {hcpNearMe.map((elm, idx) => (
                <onekey-sdk-doctor-card selected={this.selectedMarkerIdx === idx} {...elm} onClick={this.onItemCardClick} />
              ))}
            </div>

            {!!hcpNearMe.length && (
              <onekey-sdk-map
                class="search-map__content"
                locations={hcpNearMe}
                selectedLocationIdx={0}
                defaultZoom={configStore.state.mapDefaultZoom}
                mapTileLayer={configStore.state.mapTileLayer}
                mapLink={configStore.state.mapLink}
                markerIcon={configStore.state.markerIcon}
                markerIconCurrentLocation={configStore.state.markerIconCurrentLocation}
              />
            )}
          </div>
        </div>
      </Host>
    );
  }
}
