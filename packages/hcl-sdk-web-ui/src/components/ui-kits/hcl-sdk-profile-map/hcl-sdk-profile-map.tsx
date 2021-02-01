import { Component, Host, h } from '@stencil/core';
import { uiStore, searchMapStore } from 'hcl-sdk-web-ui/src/core/stores';
import { getCssColor } from 'hcl-sdk-web-ui/src/utils/helper';

@Component({
  tag: 'hcl-sdk-profile-map',
  styleUrl: 'hcl-sdk-profile-map.scss',
  shadow: false,
})
export class HclSdkProfileMap {

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
              <hcl-sdk-icon name="location" color={getCssColor('--hcl-color-marker_selected')} width={13} height={20}/>
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
            <hcl-sdk-map 
              mapHeight={`100%`}
              mapMinHeight={'200px'}
              locations={[{ lat: individualDetail.lat, lng: individualDetail.lng }]}
              selectedLocationIdx={0}
              defaultZoom={12}
              noCurrentLocation
            />
          </div>
        </div>
      </Host>
    );
  }
}
