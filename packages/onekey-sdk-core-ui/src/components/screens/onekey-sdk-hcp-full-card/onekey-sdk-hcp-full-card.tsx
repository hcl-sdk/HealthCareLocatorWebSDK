import { Component, Host, h } from '@stencil/core';

import 'ionicons'
import { configStore, routerStore } from 'onekey-sdk-core-ui/src/core/stores';
import { getCssColor } from 'onekey-sdk-core-ui/src/utils/helper';

@Component({
  tag: 'onekey-sdk-hcp-full-card',
  styleUrl: 'onekey-sdk-hcp-full-card.scss',
  shadow: false
})
export class OnekeySdkHCPFullCard {

  goBack = () => {
    routerStore.push("/search")
  }

  render() {
    return (
      <Host class={`size-${configStore.state.viewPortSize}`}>
        {
          ['lg', 'xl'].includes(configStore.state.viewPortSize) && (
            <div class="main-block main-block--header">
              <onekey-sdk-search searchText="Search" />
            </div>
          )
        }
        <div class="main-contain">
          <div class="main-block main-block--header">
            <div class="main-block__navigation">
              <onekey-sdk-button noBorder icon="arrow" iconColor="black" onClick={this.goBack}>Back to result list</onekey-sdk-button>
              <onekey-sdk-button noBorder icon="share" iconColor="black"/>
            </div>
          </div>

          <div class="main-block">
            <div class="main-info">
              <div class="main-info__name">
                <div class="main-info__avatar">
                  <onekey-sdk-icon name="default-avatar" width={30} height={30} />
                </div>
                <div class="main-info__profile">
                  <span class="main-info__profile-name">Dr Boksenbaum Michel</span>
                  <span class="main-info__profile-dep">General Practitioner</span>
                </div>
              </div>

              <div class="info-section">
                <onekey-sdk-map
                  class="info-section-body__map hidden-lg hidden-xl"
                  locations={[{ lat: 48.863699, lng: 2.4833 }]}
                  selectedLocationIdx={0}
                  defaultZoom={5}
                  noCurrentLocation
                  zoomControl={false}
                  mapHeight="100px"
                  dragging={false}
                />
                
                <div class="info-section-header">
                  <span class="info-section-header__title">Main Information</span>
                  <div class="info-section-header__postfix">
                    <onekey-sdk-button round icon="direction" noBackground iconColor={getCssColor("--onekeysdk-color-secondary")}/>
                    <onekey-sdk-button round icon="phone" noBackground iconColor={getCssColor("--onekeysdk-color-secondary")} />
                  </div>
                </div>

                <div class="info-section-body">
                  <div class="info-section-body__address">
                    <select>
                      <option>Address 1: Avenue Charles Girault</option>
                      <option>Address 2: Rue d'Astorg</option>
                      <option>Address 3: Rue d'Amsterdam</option>
                    </select>
                  </div>

                  <div class="info-contact info-section-body__location">
                    <div class="info-contact-item">
                      <onekey-sdk-icon name="location" color={getCssColor("--onekeysdk-color-marker")}/>
                      <div>
                        <span>Centre Médical de Soins</span>
                        <span>Service Médecine Génarale</span>
                        <span>43 Avenue Charles Girault, 75008 Paris</span>
                      </div>
                    </div>
                  </div>

                  <div class="info-contact info-section-body__contact">
                    <div class="info-contact-item">
                      <onekey-sdk-icon name="phone" />
                      <span>01 44 58 56 58</span>
                    </div>
                    <div class="info-contact-item">
                      <onekey-sdk-icon name="printer" height={15} />
                      <span>01 44 58 56 58</span>
                    </div>
                  </div>

                  <div class="info-contact info-section-body__website">
                    <div class="info-contact-item">
                      <onekey-sdk-icon name="earth" />
                      <span>www.medicalsoinsparis.com</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Block */}
              <div class="info-section">
                <div class="info-section-header">
                  <span class="info-section-header__title">Specialities</span>
                </div>

                <div class="info-section-body">
                  <span>Generalist, Cardiology, Neurologist</span>
                </div>
              </div>

              {/* Block */}
              <div class="info-section">
                <div class="info-section-header">
                  <span class="info-section-header__title">Rate and refunds</span>
                </div>

                <div class="info-section-body">
                  <span>Conventionned Sector 1</span>
                  <span>25€</span>
                </div>
              </div>

              {/* Block */}
              <div class="info-section">
                <div class="info-section-header">
                  <span class="info-section-header__title">Information</span>
                </div>

                <div class="info-section-body">
                  <span>Was the information you were given about this HCP/HCO correct?</span>
                  <div class="info-contact info-section-body__correct">
                    <div class="info-contact-item">
                      <onekey-sdk-button icon="like" />
                      <span>Yes</span>
                    </div>
                    <div class="info-contact-item">
                      <onekey-sdk-button icon="dislike" />
                      <span>No</span>
                    </div>
                  </div>
                </div>
              </div>

               {/* Block */}
               
              <div class="info-section">
                <div class="info-section-header">
                  <span class="info-section-header__title">Improve the data quality</span>
                </div>

                <div class="info-section-body">
                  <span>Lorem ipsum dolor sit amet, consectetur adipis elit. Vivamus pretium auctor accumsan.</span>

                  <onekey-sdk-button isFull>
                    <onekey-sdk-icon name="edit" color={getCssColor("--onekeysdk-color-secondary")} />
                    <span>Suggest a modification</span>
                  </onekey-sdk-button>
                </div>
              </div>
              {/* Block */}

             
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
