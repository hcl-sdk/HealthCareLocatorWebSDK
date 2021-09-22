import { Component, Host, h, Event, Listen, State, EventEmitter } from '@stencil/core';
import cls from 'classnames';
import { uiStore, searchMapStore, configStore, i18nStore } from '../../../core/stores';
import { getFullCardDetail } from '../../../core/api/hcp';
import { getCssColor, getPrimaryAddressIndividual, getTextBodyToShare } from '../../../utils/helper';
import { t } from '../../../utils/i18n';
import { HCL_WEBSITE_HOST } from '../../../core/constants';
import { OKSDK_MAP_HCP_VOTED, storageUtils } from '../../../utils/storageUtils';

const MAX_DISPLAY_TERMS = 5

@Component({
  tag: 'hcl-sdk-hcp-full-card',
  styleUrl: 'hcl-sdk-hcp-full-card.scss',
  shadow: false,
})
export class HclSdkHCPFullCard {
  @Event() backFromHcpFullCard: EventEmitter<MouseEvent>;
  @State() mapHcpVoted: Record<string, boolean> = {};
  @State() currentSeachTerm: string = ''
  @State() isViewMoreTerms: boolean = false;

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
    if (searchMapStore.state.selectedActivity) {
      getFullCardDetail({
        activityId: searchMapStore.state.selectedActivity.id,
        activityName: searchMapStore.state.selectedActivity.name,
      });
    }

    this.mapHcpVoted = storageUtils.getObject(OKSDK_MAP_HCP_VOTED, {})
  }

  componentWillUpdate() {
    const { medicalTermsFilter } = searchMapStore.state

    if (this.currentSeachTerm || !medicalTermsFilter || !medicalTermsFilter.name) {
      return
    }

    // Copy and keep the current search
    //  to avoid users change the search terms in the second time
    //  but not click on the button search yet.
    this.currentSeachTerm = medicalTermsFilter.name.toLowerCase()
  }

  disconnectedCallback() {
    searchMapStore.setState({
      individualDetail: null
    });
    configStore.setState({
      // Close the modal profile map if users not click on close icon
      modal: undefined
    })
  }

  onVoteHCP = (answer: boolean) => {
    if (!searchMapStore.state.individualDetail) {
      return
    }
    const { individualDetail } = searchMapStore.state
    const { individualId } = individualDetail

    this.mapHcpVoted = {
      ...this.mapHcpVoted,
      [individualId]: answer
    }
    storageUtils.setObject(OKSDK_MAP_HCP_VOTED, this.mapHcpVoted)
  };

  isVotedHCP = () => {
    if (!searchMapStore.state.individualDetail) {
      return undefined;
    }

    const { individualDetail } = searchMapStore.state;
    const { individualId } = individualDetail;

    return this.mapHcpVoted[individualId];
  }

  handleChangeAddress(evt) {
    if(evt.target.value) {
      getFullCardDetail({
        activityId: evt.target.value,
        activityName: searchMapStore.state.selectedActivity.name,
      }, 'loadingSwitchAddress');
    }
  }

  handleShareHCPDetail() {
    const { individualDetail } = searchMapStore.state;

    if (!individualDetail) {
      return null;
    }

    const config = {
      appName: configStore.state.appName,
      appURL: configStore.state.appURL
    }

    if (navigator.share) {
      navigator.share({
        text: getTextBodyToShare(individualDetail, {
          newLine: '\n',
          ...config
        })
      }).then(() => {
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
    const { individualDetail } = searchMapStore.state;

    if (!individualDetail) {
      return;
    }

    const individualId = individualDetail.individualId
    const apiKey = configStore.state.apiKey;

    const lang = i18nStore.state.lang.toLowerCase().replace('-', '_').split('_')[0]
    const linkEl = document.createElement('a');
    linkEl.href = `${HCL_WEBSITE_HOST}/${lang}/suggest-modification?apiKey=${apiKey}&id=${individualId}`;
    linkEl.target = "_blank";
    linkEl.click();
  }

  handleToggleViewMoreTerms = () => {
    this.isViewMoreTerms = !this.isViewMoreTerms
  }

  render() {
    const isVotedHCP = this.isVotedHCP();

    const voteHcpYesClass = cls('info-contact-item', {
      'confirm-yes': isVotedHCP,
    });

    const voteHcpNoClass = cls('info-contact-item', {
      'confirm-no': isVotedHCP === false, // undefined -> Not voted yet
    });

    const { breakpoint } = uiStore.state;
    const {
      individualDetail,
      individualDetailName,
      loadingSwitchAddress,
      loadingIndividualDetail
    } = searchMapStore.state;
    const { showSuggestModification } = configStore.state;

    const toolbarClass = cls('search-toolbar', {
      'header-block': breakpoint.screenSize === 'mobile',
    });

    const hpcProfileName = (individualDetail && individualDetail.name) || individualDetailName

    const originalListTerms = (individualDetail && individualDetail.listTerms) || []
    const listTerms = this.currentSeachTerm ? [
      this.currentSeachTerm, 
      ...originalListTerms.filter(label => label.toLowerCase() !== this.currentSeachTerm)
    ]: originalListTerms
    const isRenderMedialSubject = configStore.state.enableMedicalTerm && listTerms.length > 0

    return (
      <Host>
        <div class="main-contain">
          <div class={toolbarClass}>
            <div class="search-back-large">
              <hcl-sdk-button
                noBorder
                noBackground
                icon="arrow"
                iconColor={getCssColor('--hcl-color-dark')}
                onClick={this.backFromHcpFullCard.emit}>
                <span class="hidden-mobile">{
                  searchMapStore.state.navigatedFromHome ? t('back_to_home') : t('back_to_search_results')
                }
                </span>
              </hcl-sdk-button>
            </div>
            <hcl-sdk-button
              noBorder
              noBackground
              icon="share"
              iconColor={getCssColor('--hcl-color-grey_dark')}
              onClick={this.handleShareHCPDetail}
            />
          </div>

          <div class="main-block hcp-details-card">
            <div class="main-info">
              <div class="main-info__name">
                <div class="main-info__avatar">
                  <hcl-sdk-icon name="default-avatar" width={30} height={30} />
                </div>
                <div class="main-info__profile">
                  <span class="main-info__profile-name">{hpcProfileName}</span>
                  <span class="main-info__profile-dep">{individualDetail && individualDetail.professionalType}</span>
                </div>
              </div>

              {loadingIndividualDetail && !individualDetail && (
                <div class="hcp-details-card__loading">
                  <hcl-sdk-icon name="circular" />
                </div>
              )}
              {individualDetail && (
                <div>
                  <div class="info-section">
                    {breakpoint.screenSize === 'mobile' && (
                      <hcl-sdk-map
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
                          <hcl-sdk-button round icon="direction" noBackground iconColor={getCssColor('--hcl-color-secondary')} />
                        </a>
                        {
                          individualDetail.phone && (
                            <a href={`tel:${individualDetail.phone}`}>
                              <hcl-sdk-button round icon="phone" noBackground iconColor={getCssColor('--hcl-color-secondary')} />
                            </a>
                          )
                        }
                      </div>
                    </div>

                    <div class="info-section-body">
                      {
                        individualDetail && individualDetail.activitiesList.length >= 2 && (
                          <div class="info-section-body__address">
                            <hcl-sdk-select
                              value={individualDetail.id}
                              loading={loadingSwitchAddress}
                              options={individualDetail.activitiesList.map(({id, workplace}, index: number) => ({
                                value: id,
                                label: `Address ${index+1}: ${workplace.address.longLabel}`,
                              }))}
                              onChange={this.handleChangeAddress}
                            />
                          </div>
                        )
                      }

                      <div class="info-contact info-section-body__location">
                        <div class="info-contact-item">
                          <hcl-sdk-icon name="location" color={getCssColor('--hcl-color-marker_selected')} />
                          <div>
                            {
                              getPrimaryAddressIndividual(individualDetail)
                                .map(str => (<span>{str}</span>))
                            }
                          </div>
                        </div>
                      </div>

                      {
                        (individualDetail.phone || individualDetail.fax) && (
                          <div class="info-contact info-section-body__contact">
                            {individualDetail.phone && (
                              <div class="info-contact-item">
                                <hcl-sdk-icon name="phone" color={getCssColor('--hcl-color-grey')} />
                                <a href={`tel:${individualDetail.phone}`}>{individualDetail.phone}</a>
                              </div>
                            )}

                            {individualDetail.fax && (
                              <div class="info-contact-item">
                                <hcl-sdk-icon name="printer" height={15} color={getCssColor('--hcl-color-grey')} />
                                <a href={`tel:${individualDetail.fax}`}>{individualDetail.fax}</a>
                              </div>
                            )}
                          </div>
                        )
                      }

                      {individualDetail.webAddress && (
                        <div class="info-contact info-section-body__website">
                          <div class="info-contact-item">
                            <hcl-sdk-icon name="earth" color={getCssColor('--hcl-color-grey')} />
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
                        <span>{individualDetail.specialties.join(', ')}</span>
                      </div>
                    </div>
                  }
                  {
                    isRenderMedialSubject && (
                      <div class="info-section">
                        <div class="info-section-header">
                          <span class="info-section-header__title">{t('medical_publication_subject_heading')} ({listTerms.length})</span>
                        </div>

                        <div class="info-section-body">
                          <ul class="medical-subjects">
                          {
                            listTerms.map((label: string, idx: number) => {
                              if (!this.isViewMoreTerms && idx >= MAX_DISPLAY_TERMS) {
                                return null
                              }

                              return (
                                <li class={cls('medical-subjects__item', {
                                  'medical-subjects__item--highlight': label.toLowerCase() === this.currentSeachTerm
                                })}>{label}</li>
                              )
                            })
                          }
                          {
                            listTerms.length > MAX_DISPLAY_TERMS && (
                              <li class="medical-subjects__view-more">
                                <hcl-sdk-button
                                  onClick={this.handleToggleViewMoreTerms}
                                  class={cls({ 'view-less': this.isViewMoreTerms })}
                                  noBackground noBorder noPadding isLink icon="chevron-arrow" iconWidth={15} iconHeight={15}>
                                  { !this.isViewMoreTerms ? t('view_more') : t('view_less') }
                                </hcl-sdk-button>
                              </li>
                            )
                          }
                          </ul>
                        </div>
                      </div>
                    )
                  }
                </div>
              )}
              {/* Block Rate and refunds */}
              {/* <div class="info-section">
                <div class="info-section-header">
                  <span class="info-section-header__title">{t('rate_refunds_label')}</span>
                </div>

                <div class="info-section-body">
                  <span>Conventionned Sector 1</span>
                  <span>25€</span>
                </div>
              </div> */}

              {/* Block Information */}
              <div class="info-section">
                <div class="info-section-header">
                  <span class="info-section-header__title">{t('information_label')}</span>
                </div>

                <div class="info-section-body">
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
                </div>
              </div>

              {/* Block */}
              {
                showSuggestModification && (
                  <div class="info-section">
                    <div class="info-section-header">
                      <span class="info-section-header__title">{t('improve_quality_label')}</span>
                    </div>

                    <div class="info-section-body">
                      <span>{t('improve_quality_text')}</span>

                      <hcl-sdk-button isFull class="hclsdk-btn-suggest-edit" onClick={this.handleClickSuggestEdit}>
                        <hcl-sdk-icon name="edit" color={getCssColor('--hcl-color-secondary')} />
                        <span>{t('suggess_modification_button')}</span>
                      </hcl-sdk-button>
                    </div>
                  </div>
                )
              }
              {/* Block */}
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
