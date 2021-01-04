import { Component, Host, h } from '@stencil/core';
// import cn from 'classnames';
import { uiStore, configStore, searchMapStore } from 'onekey-sdk-web-ui/src/core/stores';
import { getCssColor } from 'onekey-sdk-web-ui/src/utils/helper';

@Component({
  tag: 'onekey-sdk-profile-map',
  styleUrl: 'onekey-sdk-profile-map.scss',
  shadow: false,
})
export class OnekeySdkProfileMap {
  
  render() {
    const { individualDetail } = searchMapStore.state;

    if (!individualDetail) {
      return null;
    }

    return (
      <Host class={`size-${uiStore.state.breakpoint.screenSize}`}>
        <div class="profile-map">
          <div class="profile-map__head">
            <div class="profile-map__head--icon">
              <onekey-sdk-icon name="location" color={getCssColor('--onekeysdk-color-marker_selected')} width={13} height={20}/>
            </div>
            <div class="profile-map__head--text">
              <p class="profile-map__head--label">Address 1</p>
              <p class="profile-map__head--address">
                <span>{individualDetail.addressName}</span>
                <span>{individualDetail.addressBuildingName}</span>
                <span>{individualDetail.address}</span>
              </p>
            </div>
          </div>
          <div class="profile-map__content">
            <onekey-sdk-map 
              mapHeight={`100%`}
              mapMinHeight={'100px'}
              locations={[{ lat: individualDetail.lat, lng: individualDetail.lng }]}
              selectedLocationIdx={0}
              defaultZoom={5}
              noCurrentLocation
              zoomControl={false}
              interactive={false}
            />
          </div>
        </div>
      </Host>
    );
  }
}
