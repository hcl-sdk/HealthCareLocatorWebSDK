import { Component, Host, h, Event, State, EventEmitter } from '@stencil/core';
import cls from 'classnames';
import { uiStore, searchMapStore } from 'onekey-sdk-web-ui/src/core/stores';
import { getFullCardDetail } from 'onekey-sdk-web-ui/src/core/api/hcp';
import { getCssColor } from 'onekey-sdk-web-ui/src/utils/helper';
import { t } from '../../../utils/i18n';
@Component({
  tag: 'onekey-sdk-hcp-full-card',
  styleUrl: 'onekey-sdk-hcp-full-card.scss',
  shadow: false,
})
export class OnekeySdkHCPFullCard {
  @Event() backFromHcpFullCard: EventEmitter<MouseEvent>;
  @State() confirm: boolean;

  componentWillLoad() {
    getFullCardDetail({
      activityId: searchMapStore.state.selectedActivity.id,
      activityName: searchMapStore.state.selectedActivity.name,
    });
  }

  disconnectedCallback() {
    searchMapStore.setState({
      individualDetail: null
    });
  }

  onConfirm = answer => {
    this.confirm = answer;
  };

  render() {
    const confirmYesClass = cls('info-contact-item', {
      'confirm-yes': this.confirm === true,
    });

    const confirmNoClass = cls('info-contact-item', {
      'confirm-no': this.confirm === false,
    });

    const { individualDetail, loadingIndividualDetail, individualDetailName } = searchMapStore.state;
    const { breakpoint } = uiStore.state;

    const toolbarClass = cls('search-toolbar search-section', {
      'header-block': breakpoint.screenSize === 'mobile',
    });

    const hpcProfileName = (individualDetail && individualDetail.name) || individualDetailName

    return (
      <Host>
        <div class="main-contain">
          <div class={toolbarClass}>
            <div class="search-back-large">
              <onekey-sdk-button noBorder noBackground icon="arrow" iconColor={getCssColor('--onekeysdk-color-dark')} onClick={this.backFromHcpFullCard.emit}>
                <span class="hidden-mobile">{t('back_to_search_results')}</span>
              </onekey-sdk-button>
            </div>
            <onekey-sdk-button noBorder noBackground icon="share" iconColor={getCssColor('--onekeysdk-color-grey_dark')} />
          </div>

          <div class="main-block hcp-details-card">
            <div class="main-info">
              <div class="main-info__name">
                <div class="main-info__avatar">
                  <onekey-sdk-icon name="default-avatar" width={30} height={30} />
                </div>
                <div class="main-info__profile">
                  <span class="main-info__profile-name">{hpcProfileName}</span>
                  <span class="main-info__profile-dep">{individualDetail && individualDetail.professionalType}</span>
                </div>
              </div>

              {loadingIndividualDetail && !individualDetail && (
                <div class="hcp-details-card__loading">
                  <onekey-sdk-icon name="circular" />
                </div>
              )}
              {individualDetail && (
                <div>
                  <div class="info-section">
                    {breakpoint.screenSize === 'mobile' && (
                      <onekey-sdk-map
                        class="info-section-body__map"
                        locations={[{ lat: individualDetail.lat, lng: individualDetail.lng }]}
                        selectedLocationIdx={0}
                        defaultZoom={5}
                        noCurrentLocation
                        zoomControl={false}
                        mapHeight="100px"
                        interactive={false}
                      />
                    )}

                    <div class="info-section-header">
                      <span class="info-section-header__title">{t('main_information_label')}</span>
                      <div class="info-section-header__postfix">
                        <a href={`https://maps.google.com/?q=${individualDetail.lat},${individualDetail.lng}`} target="_blank">
                          <onekey-sdk-button round icon="direction" noBackground iconColor={getCssColor('--onekeysdk-color-secondary')} />
                        </a>
                        <a href={`tel:${individualDetail.phone}`}>
                          <onekey-sdk-button round icon="phone" noBackground iconColor={getCssColor('--onekeysdk-color-secondary')} />
                        </a>
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
                          <onekey-sdk-icon name="location" color={getCssColor('--onekeysdk-color-marker_selected')} />
                          <div>
                            <span>{individualDetail.addressName}</span>
                            <span>{individualDetail.addressBuildingName}</span>
                            <span>{individualDetail.address}</span>
                          </div>
                        </div>
                      </div>

                      <div class="info-contact info-section-body__contact">
                        {individualDetail.phone && (
                          <div class="info-contact-item">
                            <onekey-sdk-icon name="phone" color={getCssColor('--onekeysdk-color-grey')} />
                            <a href={`tel:${individualDetail.phone}`}>{individualDetail.phone}</a>
                          </div>
                        )}

                        {individualDetail.fax && (
                          <div class="info-contact-item">
                            <onekey-sdk-icon name="printer" height={15} color={getCssColor('--onekeysdk-color-grey')} />
                            <a href={`tel:${individualDetail.fax}`}>{individualDetail.fax}</a>
                          </div>
                        )}
                      </div>

                      {individualDetail.webAddress && (
                        <div class="info-contact info-section-body__website">
                          <div class="info-contact-item">
                            <onekey-sdk-icon name="earth" color={getCssColor('--onekeysdk-color-grey')} />
                            <a href={individualDetail.webAddress} target="_blank">
                              {individualDetail.webAddress}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Block */}
                  {
                    individualDetail.specialties.length > 0 &&
                    <div class="info-section">
                      <div class="info-section-header">
                        <span class="info-section-header__title">{t('specialities_label')}</span>
                      </div>

                      <div class="info-section-body">
                        <span>{individualDetail.specialties.join(',')}</span>
                      </div>
                    </div>
                  }
                </div>
              )}
              {/* Block Rate and refunds */}
              <div class="info-section">
                <div class="info-section-header">
                  <span class="info-section-header__title">{t('rate_refunds_label')}</span>
                </div>

                <div class="info-section-body">
                  <span>Conventionned Sector 1</span>
                  <span>25€</span>
                </div>
              </div>

              {/* Block Information */}
              <div class="info-section">
                <div class="info-section-header">
                  <span class="info-section-header__title">{t('information_label')}</span>
                </div>

                <div class="info-section-body">
                  <span>{t('information_description')}</span>
                  <div class="info-contact info-section-body__correct">
                    <div class={confirmYesClass} onClick={() => this.onConfirm(true)}>
                      <onekey-sdk-button class="btn-rate" iconWidth={15} iconHeight={14} icon="like" />
                      <span>{t('information_yes_label')}</span>
                    </div>
                    <div class={confirmNoClass} onClick={() => this.onConfirm(false)}>
                      <onekey-sdk-button class="btn-rate" iconWidth={15} iconHeight={14} icon="dislike" />
                      <span>{t('information_no_label')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Block */}

              <div class="info-section">
                <div class="info-section-header">
                  <span class="info-section-header__title">{t('improve_quality_label')}</span>
                </div>

                <div class="info-section-body">
                  <span>Lorem ipsum dolor sit amet, consectetur adipis elit. Vivamus pretium auctor accumsan.</span>

                  <onekey-sdk-button isFull class="suggest-edit-btn">
                    <onekey-sdk-icon name="edit" color={getCssColor('--onekeysdk-color-secondary')} />
                    <span>{t('suggess_modification_button')}</span>
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
