import { Component, Host, h, Event, Listen, State, EventEmitter } from '@stencil/core';
import cls from 'classnames';
import { uiStore, searchMapStore, configStore, i18nStore } from '../../../core/stores';
import { getFullCardDetail } from '../../../core/api/hcp';
import { getCssColor, getPrimaryAddressIndividual, getTextBodyToShare } from '../../../utils/helper';
import { t } from '../../../utils/i18n';
import { HCL_WEBSITE_HOST } from '../../../core/constants';
import { OKSDK_MAP_HCP_VOTED, storageUtils } from '../../../utils/storageUtils';
import { SearchSpecialty } from '../../../core/stores/SearchMapStore';
import { localizeDay, WeekDayToNumber } from '../../../utils/dateUtils';
import startOfTomorrow from 'date-fns/startOfTomorrow'
import { format } from 'date-fns';

const MAX_DISPLAY_TERMS = 5

@Component({
  tag: 'hcl-sdk-hcp-full-card',
  styleUrl: 'hcl-sdk-hcp-full-card.scss',
  shadow: false,
})
export class HclSdkHCPFullCard {
  @Event() backFromFullCard: EventEmitter<MouseEvent>;
  @State() mapHcpVoted: Record<string, boolean> = {};
  @State() isViewMoreTerms: boolean = false;
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

    if (!medicalTermsFilter || !medicalTermsFilter.name) {
      return
    }
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

  handleToggleViewMoreSpecialties = () => {
    this.isViewMoreSpecialties = !this.isViewMoreSpecialties
  }

  moveHighlightedSpecialtiesOnTop(originalListSpecialties: SearchSpecialty[], specialtyFilter: SearchSpecialty[]) {
    const highlightSpecialties = originalListSpecialties.filter(orignalSpec => 
      specialtyFilter
        .find(spec => spec.id.toLowerCase() === orignalSpec.id.toLowerCase())
    ).map(s => ({ ...s, isHighlighted: true }))
    const exceptHighlightedSpecialties = originalListSpecialties.filter(orignalSpec => 
      !specialtyFilter
        .find(spec => spec.id.toLowerCase() === orignalSpec.id.toLowerCase())
    )
    return [
      ...highlightSpecialties,
      ...exceptHighlightedSpecialties
    ]
  }

  moveHighlightedMedTermOnTop(originalListMedTerms: string[], medTerm: string) {
    const highlightSpecialties = originalListMedTerms.filter(orignalSpec => 
      medTerm.toLowerCase() === orignalSpec.toLowerCase()
    )
    const exceptHighlightedSpecialties = originalListMedTerms.filter(orignalSpec => 
      medTerm.toLowerCase() !== orignalSpec.toLowerCase()
    )
    return [
      ...highlightSpecialties,
      ...exceptHighlightedSpecialties
    ]
  }

  toggleOpeningHoursDisclosure = () => {
    this.showOpeningHours = !this.showOpeningHours
  }

  getNextOpenEvents = (openHours) => {
   const now = new Date();

    const days = openHours.map(h => h.day)

    // get today or closest day in the future from openHours
    const nextDay = this.getNextDay(days);

    const dayToOpenPeriods = openHours.reduce((acc, cur) => {
      acc[WeekDayToNumber[cur.day]] = cur.openPeriods;
      return acc;
    }, {});

    const openTime = this.getTime(dayToOpenPeriods[nextDay].open);
    const closeTime = this.getTime(dayToOpenPeriods[nextDay].close);

    // not today or today but not open yet
    if (now.getDay() !== nextDay || this.getDayMinutes(now) < this.getDayMinutes(openTime)) {
      return {
        status: 'close',
        next: {
          status: 'open',
          time: this.formatTime(nextDay, openTime),
        },
      };
      // today, currently open
    } else if (this.getDayMinutes(now) <= this.getDayMinutes(closeTime)) {
      return {
        status: 'open',
        next: {
          status: 'close',
          time: this.formatTime(nextDay, closeTime),
        },
      };
      // today, but closed
    } else {
      const nextDay = this.getNextDay(days, startOfTomorrow())
      const openTime = this.getTime(dayToOpenPeriods[nextDay].open);

      return {
        status: 'close',
        next: {
          status: 'open',
          time: this.formatTime(nextDay, openTime)
        }
      }
    }
  };

  getNextDay = (days, from?: Date) => {
    const today = from?.getDay() || new Date().getDay();
    const availableDays = days.map(day => WeekDayToNumber[day]);

    let nextDay = null;

    for (const day of availableDays) {
      if (today <= day) {
        nextDay = day;
        break;
      }
    }

    if (!nextDay) {
      nextDay = availableDays[0];
    }

    return nextDay;
  };

  formatTime = (day: number, time: Date) => {
    const formatOption = {
      timeStyle: 'short',
      hour12: true,
    };

    return (
      localizeDay(day, i18nStore.state.lang) +
      ' ' +
      new Intl.DateTimeFormat(i18nStore.state.lang, formatOption).format(time)
    );
  };

  // format of time e.g '19:00:00'
  getTime = (openTime: string) => {
    const time = new Date();
    const timeParts = openTime.split(':');
    time.setHours(+timeParts[0]);
    time.setMinutes(+timeParts[1]);
    return time;
  };

  getDayMinutes = (openTime: Date) => {
    return openTime.getHours() * 60 + openTime.getMinutes();
  };

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
      loadingIndividualDetail,
      specialtyFilter,
      medicalTermsFilter
    } = searchMapStore.state;
    const { showSuggestModification } = configStore.state;

    const toolbarClass = cls('search-toolbar', {
      'header-block': breakpoint.screenSize === 'mobile',
    });

    const hpcProfileName = (individualDetail && individualDetail.name) || individualDetailName

    // Handle to render and highlight medical terms
    const originalListTerms = (individualDetail && individualDetail.listTerms) || []
    const listTerms = medicalTermsFilter ? this.moveHighlightedMedTermOnTop(originalListTerms, medicalTermsFilter.name) : originalListTerms;
    const isRenderMedialSubject = configStore.state.enableMedicalTerm && listTerms.length > 0
    
    // Handle to render and highlight specialties. Move the selected specialties to the first order
    const originalListSpecialties = (individualDetail && individualDetail.specialties) || []
    const listSpecialties = specialtyFilter?.length 
      ? this.moveHighlightedSpecialtiesOnTop(originalListSpecialties, specialtyFilter) 
      : originalListSpecialties

    // Handle to show Recommendation section
    const reviewResult = individualDetail?.reviewsByIndividual
    const isShowRecommendation = reviewResult && (reviewResult.diseases.length > 0 || reviewResult.reviews.length > 0)

    const openHours = individualDetail?.openHours?.filter(hour => !!hour.day)
    const openingStatus = !!openHours?.length ? this.getNextOpenEvents(openHours) : null

    const formattedOpenPeriods = (openHours ?? []).map(hour => ({
      day: localizeDay(WeekDayToNumber[hour.day], i18nStore.state.lang),
      open: format(this.getTime(hour.openPeriods.open), 'h:mm a'),
      close: format(this.getTime(hour.openPeriods.close), 'h:mm a')
    }))

    return (
      <Host>
        <div class="main-contain">
          <div class={toolbarClass}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div class="search-back-large">
                <hcl-sdk-button
                  noBorder
                  noBackground
                  icon="back"
                  iconColor={getCssColor('--hcl-color-dark')}
                  onClick={this.backFromFullCard.emit}>
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
          </div>

          <div class="main-block hcp-details-card" data-activity-id={individualDetail?.id} data-individual-id={individualDetail?.individualId}>
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
                          <hcl-sdk-button round icon="direction" noBackground />
                        </a>
                        {/* TODO: Appointment link feature */}
                        {
                          individualDetail?.url && (
                            <a href={individualDetail?.url} target='_blank'>
                              <hcl-sdk-button round icon="calendar-clock-outline" noBackground />
                            </a>
                          )
                        }
                        {
                          individualDetail.phone && (
                            <a href={`tel:${individualDetail.phone}`}>
                              <hcl-sdk-button round icon="phone" noBackground />
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
                          <hcl-sdk-icon name="geoloc" color={getCssColor('--hcl-color-marker_selected')} />
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
                                <hcl-sdk-icon name="fax" height={15} color={getCssColor('--hcl-color-grey')} />
                                <a href={`tel:${individualDetail.fax}`}>{individualDetail.fax}</a>
                              </div>
                            )}
                          </div>
                        )
                      }

                      {!!openHours?.length && (
                        <div class="opening-hours-disclosure">
                          <button class="opening-hours-disclosure__btn" onClick={this.toggleOpeningHoursDisclosure}>
                            <hcl-sdk-icon-clock-outline width={15} height={15} color={getCssColor('--hcl-color-grey')} />
                            <div>
                            {openingStatus && 
                              <span class={cls('opening-hour')}>
                                <span class={cls('opening-hour__status', { 'opening-hour__status--close': openingStatus.status === 'close' })}>
                                  {openingStatus.status}
                                </span>
                                &nbsp;&#183;&nbsp;{openingStatus.next.status} {openingStatus.next.time}
                              </span>}
                            </div>
                            <hcl-sdk-icon-arrow_down width={15} height={15} class="arrow-icon" color={getCssColor('--hcl-color-grey')} />
                          </button>
                          <div
                            class={cls('opening-hours-disclosure__panel', {
                              open: this.showOpeningHours,
                            })}
                          >
                            {formattedOpenPeriods.map(hour => (
                              <div class="opening-hour-item">
                                <div>{hour.day}</div>
                                <div>{hour.open} - {hour.close}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {individualDetail.webAddress && (
                        <div class="info-contact info-section-body__website">
                          <div class="info-contact-item">
                            <hcl-sdk-icon name="website" color={getCssColor('--hcl-color-grey')} />
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
                    (configStore.state.enableUci && (individualDetail.uciRpps || individualDetail.uciAdeli)) && (
                      <div class="info-section">
                        <div class="info-section-header">
                          <span class="info-section-header__title">{t('unique_country_identifier')}</span>
                        </div>
                        <div class="info-section-body">
                          <span>{ individualDetail.uciRpps || individualDetail.uciAdeli }</span>
                        </div>
                      </div>
                    )
                  }
                  {
                    individualDetail.specialties.length > 0 &&
                    <div class="info-section">
                      <div class="info-section-header">
                        <span class="info-section-header__title">{t('specialities_label')}</span>
                      </div>

                      <div class="info-section-body">
                        <ul class="medical-subjects">
                          {
                            listSpecialties.map((spec, idx: number) => {
                              if (!this.isViewMoreSpecialties && idx >= MAX_DISPLAY_TERMS) {
                                return null
                              }

                              return (
                                <li class={cls('medical-subjects__item', {
                                  'medical-subjects__item--highlight': spec.isHighlighted
                                })}>{ typeof spec === 'string' ? spec : spec.name}</li>
                              )
                            })
                          }
                          {
                            listSpecialties.length > MAX_DISPLAY_TERMS && (
                              <li class="medical-subjects__view-more">
                                <hcl-sdk-button
                                  onClick={this.handleToggleViewMoreSpecialties}
                                  class={cls({ 'view-less': this.isViewMoreSpecialties })}
                                  noBackground noBorder noPadding isLink icon="arrow_right" iconWidth={15} iconHeight={15}>
                                  { !this.isViewMoreSpecialties ? t('view_more') : t('view_less') }
                                </hcl-sdk-button>
                              </li>
                            )
                          }
                        </ul>
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
                            listTerms.map((label, idx: number) => {
                              if (!this.isViewMoreTerms && idx >= MAX_DISPLAY_TERMS) {
                                return null
                              }

                              return (
                                <li
                                  class={cls('medical-subjects__item', {
                                    'medical-subjects__item--highlight': medicalTermsFilter && label.toLowerCase() === medicalTermsFilter.name.toLowerCase(),
                                  })}
                                >
                                  {label}
                                </li>
                              );
                            })
                          }
                          {
                            listTerms.length > MAX_DISPLAY_TERMS && (
                              <li class="medical-subjects__view-more">
                                <hcl-sdk-button
                                  onClick={this.handleToggleViewMoreTerms}
                                  class={cls({ 'view-less': this.isViewMoreTerms })}
                                  noBackground noBorder noPadding isLink icon="arrow_right" iconWidth={15} iconHeight={15}>
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

                  {/* TODO: Mapatho feature */}
                  {
                    isShowRecommendation && (
                      <div class="info-section">
                        <div class="info-section-header">
                          <span class="info-section-header__title">Patient's Recommendation&nbsp;&nbsp;<img width="14" src="https://www.mapatho.com/favicon.ico" alt="" /></span>
                        </div>
                        <div class="info-section-body no-gap">
                          {
                            reviewResult.diseases.length > 0 && (
                              <ul class="medical-subjects">
                                { reviewResult.diseases.map(item => <li class="medical-subjects__item">{item.name}</li>) }
                              </ul>
                            )
                          }
                          {
                            <ul class="medical-subjects">
                              <li class="patient-reviews__wrap">
                                <div class="patient-reviews__title">{reviewResult.reviews.length} Patient reviews</div>
                                {/* Reviews Item */}
                                {
                                  reviewResult.reviews.map(item => (
                                    <div class="patient-reviews__item">
                                      <div class="patient-reviews__item-head">
                                        <div class="patient-reviews__item-user">
                                          <hcl-sdk-icon name="user" />
                                          <span>{item.reviewer}</span>
                                        </div>
                                        {
                                          item.diseases.map(d => <div class="patient-reviews__item-card">{d.name}</div>)
                                        }
                                      </div>
                                      <p class="patient-reviews__item-date">{item.createdAt}</p>
                                      <p class="patient-reviews__item-content">{item.text}</p>
                                    </div>
                                  ))
                                }
                              </li>
                              {
                                reviewResult.reviews.length > 5 && (
                                  <li class="medical-subjects__view-more">
                                    <hcl-sdk-button noBackground noBorder noPadding isLink icon="arrow_right" iconWidth={15} iconHeight={15}>
                                      { t('view_more') }
                                    </hcl-sdk-button>
                                  </li>
                                )
                              }
                            </ul>
                          }
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
