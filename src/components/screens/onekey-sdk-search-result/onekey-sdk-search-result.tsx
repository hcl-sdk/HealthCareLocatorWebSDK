import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { getHCPNearMe } from '../../../core/api/hcp';
import { SetStore, Store, StoreProps } from '../../onekey-sdk-store/provider';

@Component({
  tag: 'onekey-sdk-search-result',
  styleUrl: 'onekey-sdk-search-result.scss',
  shadow: true,
})
export class OnekeySdkSearchResult {
  @Prop() store: StoreProps;
  @Prop() setStore: SetStore;
  @State() hcpNearMeLocations = [];

  componentDidLoad() {
    getHCPNearMe(this.setStore);

    console.log(this.store)
  }

  @Watch('store')
  watchHandler(newValue: StoreProps) {
    if (newValue.hcpNearMe?.length) {
      this.hcpNearMeLocations = [...newValue.hcpNearMe];
    }
  }

  onItemCardClick = () => {

  }

  render() {
    return (
      <Host>
        <div class="search-result" style={{ height: this.store.config.appHeight }}>
          <div class="search-header search-section">
            <div>
              <onekey-sdk-router-link url="/" class="btn-back">
                <ion-icon name="arrow-back-outline" size="large"></ion-icon>
              </onekey-sdk-router-link>
            </div>
            <div>
              <strong>{this.store.search.name}</strong>
              <div>{this.store.search.selectedItem.label}</div>
            </div>
          </div>
          <div class="search-toolbar search-section">
            <div>Results: {this.hcpNearMeLocations.length}</div>
            <div>List View</div>
          </div>
          <div class="search-map search-section">
            <div class="search-data">
              {
                this.hcpNearMeLocations.map(elm => (
                  <onekey-sdk-doctor-item-swipe {...elm} onClick={this.onItemCardClick} />
                ))
              }
            </div>

            {
            !!this.hcpNearMeLocations.length && 
              <onekey-sdk-map
                class="search-map__content"
                locations={this.hcpNearMeLocations}
                selectedLocationIdx={0}
                defaultZoom={5}
                mapTileLayer={this.store.config.mapTileLayer}
                mapLink={this.store.config.mapLink}
                markerIcon={this.store.config.markerIcon}
                markerIconCurrentLocation={this.store.config.markerIconCurrentLocation}
              />
            }
          </div>
        </div>
      </Host>
    );
  }
}

Store.injectProps(OnekeySdkSearchResult, ['store', 'setStore']);
