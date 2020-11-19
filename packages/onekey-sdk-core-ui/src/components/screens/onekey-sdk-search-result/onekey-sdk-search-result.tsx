import { Component, Host, h } from '@stencil/core';
import { getHCPNearMe } from '../../../core/api/hcp';
import { configStore, searchMapStore } from '../../../core/stores';

@Component({
  tag: 'onekey-sdk-search-result',
  styleUrl: 'onekey-sdk-search-result.scss',
  shadow: false,
})
export class OnekeySdkSearchResult {
  componentWillLoad() {
    getHCPNearMe();
  }
  searchDataCardList;

  onItemCardClick = () => {};

  onMarkerClick = e => {
    const selectedMarkerIdx = searchMapStore.state.hcpNearMe.findIndex(item => item.lat === e.latlng.lat && item.lng === e.latlng.lng);
    this.searchDataCardList.scrollLeft = 306*selectedMarkerIdx;
  };

  render() {
    if (!searchMapStore.state.search) {
      return null;
    }

    const { hcpNearMe } = searchMapStore.state;

    return (
      <Host>
        {searchMapStore.state.loading && <onekey-sdk-loading></onekey-sdk-loading>}
        <div class="search-result" style={{ height: configStore.state.appHeight }}>
          <div class="search-header search-section">
            <div>
              <onekey-sdk-router-link url="/" class="btn-back">
                <ion-icon name="arrow-back-outline" size="large"></ion-icon>
              </onekey-sdk-router-link>
            </div>
            <div>
              <strong>{searchMapStore.state.search.name}</strong>
              <div>{searchMapStore.state.search.selectedItem.label}</div>
            </div>
          </div>
          <div class="search-toolbar search-section">
            <div>Results: {hcpNearMe.length}</div>
            <div>List View</div>
          </div>
          <div class="search-map search-section">
            <div class="search-data" ref={el => this.searchDataCardList = el as HTMLInputElement}>
              {hcpNearMe.map(elm => (
                <onekey-sdk-doctor-card {...elm} onClick={this.onItemCardClick} />
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
                onMarkerClick={this.onMarkerClick}
              />
            )}
          </div>
        </div>
      </Host>
    );
  }
}
