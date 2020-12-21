import { Component, Host, h, Prop, State } from '@stencil/core';
import cls from 'classnames';
import { uiStore, searchMapStore } from 'onekey-sdk-web-ui/src/core/stores';
import { getCssColor } from 'onekey-sdk-web-ui/src/utils/helper';
@Component({
  tag: 'onekey-sdk-hcp-full-card',
  styleUrl: 'onekey-sdk-hcp-full-card.scss',
  shadow: false
})
export class OnekeySdkHCPFullCard {
  @Prop() goBack: (e: any) => void;
  @State() confirm: boolean;

  onConfirm = (answer) => {
    this.confirm = answer
  }

  render() {
    const confirmYesClass = cls("info-contact-item", {
      'confirm-yes': this.confirm === true
    })

    const confirmNoClass = cls("info-contact-item", {
      'confirm-no': this.confirm === false
    })

    const { loading, individualDetail } = searchMapStore.state

    if(loading) {
      return null
    }

    return (
      <Host>
        <div class="main-contain">
          <div class="main-block main-block--content">
            <div class="main-block__navigation">
              <onekey-sdk-button class="search-back-large" noBorder noBackground icon="arrow" iconColor={getCssColor("--onekeysdk-color-grey")} onClick={this.goBack}>
                <span class="hidden-mobile">Back to result list</span>
              </onekey-sdk-button>
              <onekey-sdk-button noBorder noBackground icon="share" iconColor={getCssColor("--onekeysdk-color-grey")}/>
            </div>
          </div>

          <div class="main-block hcp-details-card">
            <div class="main-info">
              <div class="main-info__name">
                <div class="main-info__avatar">
                  <onekey-sdk-icon name="default-avatar" width={30} height={30} />
                </div>
                <div class="main-info__profile">
                  <span class="main-info__profile-name">{individualDetail.name}</span>
                  <span class="main-info__profile-dep">{individualDetail.professionalType}</span>
                </div>
              </div>

              <div class="info-section">
                <onekey-sdk-map
                  class="info-section-body__map hidden-lg hidden-xl"
                  locations={[{ lat: individualDetail.lat, lng: individualDetail.lng }]}
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
                    <a href={`https://maps.google.com/?q=${individualDetail.lat},${individualDetail.lng}`} target="_blank"><onekey-sdk-button round icon="direction" noBackground iconColor={getCssColor("--onekeysdk-color-secondary")}/></a>
                    <a href={`tel:${individualDetail.phone}`}><onekey-sdk-button round icon="phone" noBackground iconColor={getCssColor("--onekeysdk-color-secondary")} /></a>
                  </div>
                </div>

                <div class="info-section-body">
                  {/* <div class="info-section-body__address">
                    <select>
                      <option>Address 1: {individualDetail.address}</option>
                    </select>
                  </div> */}

                  <div class="info-contact info-section-body__location">
                    <div class="info-contact-item">
                      <onekey-sdk-icon name="location" color={getCssColor("--onekeysdk-color-marker_selected")}/>
                      <div>
                        <span>{individualDetail.addressName}</span>
                        <span>{individualDetail.addressBuildingName}</span>
                        <span>{individualDetail.address}</span>
                      </div>
                    </div>
                  </div>

                  <div class="info-contact info-section-body__contact">
                    {
                      individualDetail.phone &&
                      <div class="info-contact-item">
                        <onekey-sdk-icon name="phone" color={getCssColor("--onekeysdk-color-grey")}/>
                        <a href={`tel:${individualDetail.phone}`}>{individualDetail.phone}</a>
                      </div>
                    }

                    {
                      individualDetail.fax &&
                      <div class="info-contact-item">
                        <onekey-sdk-icon name="printer" height={15} color={getCssColor("--onekeysdk-color-grey")} />
                        <a href={`tel:${individualDetail.fax}`}>{individualDetail.fax}</a>
                      </div>
                    }
                  </div>

                  {
                    individualDetail.webAddress &&
                    <div class="info-contact info-section-body__website">
                      <div class="info-contact-item">
                        <onekey-sdk-icon name="earth" color={getCssColor("--onekeysdk-color-grey")} />
                        <a href={individualDetail.webAddress} target="_blank">{individualDetail.webAddress}</a>
                      </div>
                    </div>
                  }
                </div>
              </div>
              {/* Block */}
              <div class="info-section">
                <div class="info-section-header">
                  <span class="info-section-header__title">Specialities</span>
                </div>

                <div class="info-section-body">
                  <span>{individualDetail.specialties.join(",")}</span>
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
                    <div class={confirmYesClass} onClick={() => this.onConfirm(true)}>
                      <onekey-sdk-button icon="like" />
                      <span>Yes</span>
                    </div>
                    <div class={confirmNoClass} onClick={() => this.onConfirm(false)}>
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
