import { Component, Event, EventEmitter, Fragment, h, Host, Listen, State } from '@stencil/core';
import cls from 'classnames';
import { getFullCardDetail } from '../../../core/api/hco';
import { HCL_WEBSITE_HOST } from '../../../core/constants';
import { configStore, i18nStore, searchMapStore, uiStore } from '../../../core/stores';
import { getCssColor, getTextBodyToShare } from '../../../utils/helper';
import { t } from '../../../utils/i18n';
import { OKSDK_MAP_HCP_VOTED, storageUtils } from '../../../utils/storageUtils';

const MAX_DISPLAY_TERMS = 3;

@Component({
  tag: 'hcl-sdk-hco-full-card',
  styleUrl: 'hcl-sdk-hco-full-card.scss',
  shadow: false,
})
export class HclSdkHCOFullCard {
  @Event() backFromFullCard: EventEmitter<MouseEvent>;
  @State() mapHcpVoted: Record<string, boolean> = {};
  @State() isViewMoreIndividuals: boolean = false;
  @State() isViewMoreSpecialties: boolean = false;
  @State() showOpeningHours: boolean = false;

  @Listen('mapClicked')
  onMapClicked() {
    configStore.setState({
      modal: {
        title: '',
        className: 'profile-map__modal',
        component: 'hcl-sdk-profile-map',
      },
    });
  }

  componentWillLoad() {
    if (searchMapStore.state.selectedHco) {
      getFullCardDetail({
        hcoId: searchMapStore.state.selectedHco.id,
      });
    }

    this.mapHcpVoted = storageUtils.getObject(OKSDK_MAP_HCP_VOTED, {});
  }

  componentWillUpdate() {
    const { medicalTermsFilter } = searchMapStore.state;

    if (!medicalTermsFilter || !medicalTermsFilter.name) {
      return;
    }
  }

  disconnectedCallback() {
    searchMapStore.setState({
      individualDetail: null,
    });
    configStore.setState({
      // Close the modal profile map if users not click on close icon
      modal: undefined,
    });
  }

  onVoteHCP = (_answer: boolean) => {
    // if (!searchMapStore.state.individualDetail) {
    //   return;
    // }
    // const { individualDetail } = searchMapStore.state;
    // const { individualId } = individualDetail;
    // this.mapHcpVoted = {
    //   ...this.mapHcpVoted,
    //   [individualId]: answer,
    // };
    // storageUtils.setObject(OKSDK_MAP_HCP_VOTED, this.mapHcpVoted);
  };

  isVotedHCP = () => {
    // if (!searchMapStore.state.individualDetail) {
    //   return undefined;
    // }
    // const { individualDetail } = searchMapStore.state;
    // const { individualId } = individualDetail;
    // return this.mapHcpVoted[individualId];
  };

  handleChangeAddress(evt) {
    if (evt.target.value) {
      getFullCardDetail(
        {
          hcoId: evt.target.value,
          // activityName: searchMapStore.state.selectedActivity.name,
        },
        'loadingSwitchAddress',
      );
    }
  }

  handleChangeService(_evt) {
    // console.log(evt);
    // TODO: implement change service
  }

  handleShare() {
    const { individualDetail } = searchMapStore.state;

    if (!individualDetail) {
      return null;
    }

    const config = {
      appName: configStore.state.appName,
      appURL: configStore.state.appURL,
    };

    if (navigator.share) {
      navigator
        .share({
          text: getTextBodyToShare(individualDetail, {
            newLine: '\n',
            ...config,
          }),
        })
        .then(() => {
          // TODO Successfully:
        })
        .catch(() => {
          configStore.setState({
            modal: {
              title: t('share_hcp_title'),
              className: 'share-hcp__modal',
              component: 'hcl-sdk-share-hcp',
            },
          });
        });
    } else {
      configStore.setState({
        modal: {
          title: t('share_hcp_title'),
          className: 'share-hcp__modal',
          component: 'hcl-sdk-share-hcp',
        },
      });
    }
  }

  handleClickSuggestEdit() {
    const { hcoDetail } = searchMapStore.state;

    if (!hcoDetail) {
      return;
    }

    const hcoId = hcoDetail.id;
    const apiKey = configStore.state.apiKey;

    const lang = i18nStore.state.lang.toLowerCase().replace('-', '_').split('_')[0];
    const linkEl = document.createElement('a');
    linkEl.href = `${HCL_WEBSITE_HOST}/${lang}/suggest-modification?apiKey=${apiKey}&id=${hcoId}`;
    linkEl.target = '_blank';
    linkEl.click();
  }

  handleToggleViewMoreIndividuals = () => {
    this.isViewMoreIndividuals = !this.isViewMoreIndividuals;
  };

  handleToggleViewMoreSpecialties = () => {
    this.isViewMoreSpecialties = !this.isViewMoreSpecialties;
  };

  render() {
    const isVotedHCP = this.isVotedHCP();

    const voteHcpYesClass = cls('info-contact-item', {
      'confirm-yes': isVotedHCP,
    });

    const voteHcpNoClass = cls('info-contact-item', {
      // 'confirm-no': isVotedHCP === false, // undefined -> Not voted yet
    });

    const { breakpoint } = uiStore.state;
    const { hcoDetail, loadingHcoDetail } = searchMapStore.state;

    const toolbarClass = cls('search-toolbar', {
      'header-block': breakpoint.screenSize === 'mobile',
    });

    return (
      <Host>
        <div class="main-contain">
          <div class={toolbarClass}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div class="search-back-large">
                <hcl-sdk-button noBorder noBackground icon="back" iconColor={getCssColor('--hcl-color-dark')} onClick={this.backFromFullCard.emit}>
                  <span class="hidden-mobile">{searchMapStore.state.navigatedFromHome ? t('back_to_home') : t('back_to_search_results')}</span>
                </hcl-sdk-button>
              </div>
              <hcl-sdk-button noBorder noBackground icon="share" iconColor={getCssColor('--hcl-color-grey_dark')} onClick={this.handleShare} />
            </div>
          </div>

          <div class="main-block hcp-details-card" data-activity-id={hcoDetail?.id}>
            <div class="main-info">
              <div class="main-info__name">
                <div class="main-info__avatar">
                  <hcl-sdk-icon name="domain" width={30} height={30} />
                </div>
                <div class="main-info__profile">
                  <span class="main-info__profile-name">{(hcoDetail && hcoDetail.name) || (searchMapStore.state.selectedHco && searchMapStore.state.selectedHco.name)}</span>
                  <span class="main-info__profile-dep">{hcoDetail && hcoDetail.department}</span>
                </div>
              </div>

              {loadingHcoDetail && !hcoDetail && (
                <div class="hcp-details-card__loading">
                  <hcl-sdk-icon name="circular" />
                </div>
              )}

              {hcoDetail && (
                <hcl-sdk-card-info-section
                  map={
                    breakpoint.screenSize === 'mobile' && (
                      <hcl-sdk-map
                        class="info-section-body__map"
                        locations={[{ lat: hcoDetail.lat, lng: hcoDetail.lng }]}
                        selectedLocationIdx={0}
                        defaultZoom={5}
                        noCurrentLocation
                        zoomControl={false}
                        mapHeight="100px"
                        interactive={false}
                      />
                    )
                  }
                  header={
                    <Fragment>
                      <span class="info-section-header__title">{t('main_information_label')}</span>
                      <div class="info-section-header__postfix">
                        <a href={`https://maps.google.com/?q=${hcoDetail.lat},${hcoDetail.lng}`} target="_blank">
                          <hcl-sdk-button round icon="direction" noBackground />
                        </a>

                        {hcoDetail.phone && (
                          <a href={`tel:${hcoDetail.phone}`}>
                            <hcl-sdk-button round icon="phone" noBackground />
                          </a>
                        )}
                      </div>
                    </Fragment>
                  }
                >
                  {hcoDetail.address && (
                    <div class="info-contact">
                      <div class="flex gap-3 w-70">
                        <hcl-sdk-icon name="geoloc" width={13} height={20} color={getCssColor('--hcl-color-marker')} />
                        {hcoDetail.address}
                      </div>
                    </div>
                  )}

                  {(hcoDetail.phone || hcoDetail.fax) && (
                    <div class="flex gap-5">
                      {hcoDetail.phone && (
                        <div class="flex gap-3">
                          <hcl-sdk-icon name="phone" width={15} height={15} color={getCssColor('--hcl-color-grey')} />
                          <a href={`tel:${hcoDetail.phone}`}>{hcoDetail.phone}</a>
                        </div>
                      )}

                      {hcoDetail.fax && (
                        <div class="flex gap-3">
                          <hcl-sdk-icon name="fax" width={16} height={14} color={getCssColor('--hcl-color-grey')} />
                          <a href={`tel:${hcoDetail.fax}`}>{hcoDetail.fax}</a>
                        </div>
                      )}
                    </div>
                  )}

                  {hcoDetail.website && (
                    <div class="info-contact info-section-body__website">
                      <div class="flex gap-3">
                        <hcl-sdk-icon name="website" width={16} height={16} color={getCssColor('--hcl-color-grey')} />
                        <a href={hcoDetail.website} target="_blank">
                          {hcoDetail.website}
                        </a>
                      </div>
                    </div>
                  )}
                </hcl-sdk-card-info-section>
              )}

              <hcl-sdk-card-info-section
                header={
                  <div class="flex flex-col items-start">
                    <span class="info-section-header__title">Individuals</span>
                    <span class="block mt-2 text-xs">Select a service and subservice to display Individuals</span>
                  </div>
                }
              >
                <div class="flex flex-col gap-2">
                  <hcl-sdk-select
                    value={'Surgery'}
                    loading={false}
                    options={['Surgery', 'Medicine'].map(service => ({
                      value: service,
                      label: 'Service: ' + service,
                    }))}
                    onChange={this.handleChangeService}
                  />
                  <hcl-sdk-select
                    value={'Surgery'}
                    loading={false}
                    options={['Surgery', 'Medicine'].map(service => ({
                      value: service,
                      label: 'Sub Service: ' + service,
                    }))}
                    onChange={this.handleChangeService}
                  />
                </div>
                <div class="flex flex-col gap-2">
                  {[
                    {
                      name: 'Dr Boksenbaum Michel',
                      specialty: 'General practitioner',
                      url: 'https://google.com',
                    },
                    {
                      name: 'Dr William Dahan',
                      specialty: 'General practitioner',
                      url: 'https://google.com',
                      isShowRecommendation: true,
                    },
                    {
                      name: 'Dr Elie Attias',
                      specialty: 'General practitioner',
                      url: 'https://google.com',
                    },
                    {
                      name: 'Dr William Dahan',
                      specialty: 'General practitioner',
                    },
                    {
                      name: 'Dr Elie Attias',
                      specialty: 'General practitioner',
                    },
                  ].map(({ name, specialty, url, isShowRecommendation }, idx: number) => {
                    if (!this.isViewMoreIndividuals && idx >= MAX_DISPLAY_TERMS) {
                      return null;
                    }

                    return (
                      <li class="hco-individual-item">
                        <div class="flex items-center gap-2 mb-1">
                          <span class="hco-individual-item__title mr-2">{name}</span>
                          {isShowRecommendation && (<img width="14" src="https://www.mapatho.com/favicon.ico" alt="" />)}
                          {url && (
                            <a href={url} target="_blank">
                              <hcl-sdk-icon width={20} height={20} name="calendar-clock-outline" color={getCssColor('--hcl-color-secondary')} />
                            </a>
                          )}
                        </div>
                        <div>{specialty}</div>
                      </li>
                    );
                  })}
                </div>
                <div class="ml-auto">
                  <span class="text-color-primary underline">
                    <hcl-sdk-button
                      onClick={this.handleToggleViewMoreIndividuals}
                      class={cls({ 'view-less': this.isViewMoreIndividuals })}
                      noBackground
                      noBorder
                      noPadding
                      isLink
                      iconWidth={15}
                      iconHeight={15}
                    >
                      {!this.isViewMoreIndividuals ? t('view_more') : t('view_less')}
                      {!this.isViewMoreIndividuals ? <hcl-sdk-icon name="arrow_down" /> : <hcl-sdk-icon name="arrow_up" />}
                    </hcl-sdk-button>
                  </span>
                </div>
              </hcl-sdk-card-info-section>

              {hcoDetail && <hcl-sdk-card-info-section title={t('unique_country_identifier')}>{hcoDetail.uci}</hcl-sdk-card-info-section>}

              <hcl-sdk-card-info-section title={t('information_label')}>
                <span>{t('information_description')}</span>
                <div class="info-contact info-section-body__correct">
                  <div class={voteHcpYesClass} onClick={() => this.onVoteHCP(true)}>
                    <hcl-sdk-button class="hclsdk-btn-rate" iconWidth={15} iconHeight={14} icon="like" />
                    <span>{t('information_yes_label')}</span>
                  </div>
                  <div class={voteHcpNoClass} onClick={() => this.onVoteHCP(false)}>
                    <hcl-sdk-button class="hclsdk-btn-rate" iconWidth={15} iconHeight={14} icon="dislike" />
                    <span>{t('information_no_label')}</span>
                  </div>
                </div>
              </hcl-sdk-card-info-section>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
