import { Component, h, Host, Event, EventEmitter } from '@stencil/core';
import { t } from '../../../../utils/i18n';

@Component({
  tag: 'hcl-sdk-home-min',
  shadow: false,
})
export class HclSdkHomeMin {
  @Event() goSearchScreen: EventEmitter;
  render() {
    return (
      <Host>
        <div class="main-block">
          <div class="home">
            <div class="header">
              <span class="title" innerHTML={t('home_title')} />
            </div>

            <div class="content">
              <div class="item">
                <div class="item__icon">
                  <hcl-sdk-icon name="search" width={17} height={17} />
                </div>
                <div class="item__message">
                  <strong>{t('home_feat_find_hcp_title')}</strong>
                  <span class="sub-text">{t('home_feat_find_hcp_text')}</span>
                </div>
              </div>
              <div class="item">
                <div class="item__icon">
                  <hcl-sdk-icon name="personal" />
                </div>
                <div class="item__message">
                  <strong>{t('home_feat_consult_profile_title')}</strong>
                  <span class="sub-text">{t('home_feat_consult_profile_text')}</span>
                </div>
              </div>
              <div class="item">
                <div class="item__icon">
                  <hcl-sdk-icon name="edit" />
                </div>
                <div class="item__message">
                  <strong>{t('home_feat_request_info_update_title')}</strong>
                  <span class="sub-text">{t('home_feat_request_info_update_text')}</span>
                </div>
              </div>
            </div>

            <div class="full-block hidden-tablet hidden-desktop">
              <hcl-sdk-button isFull primary onClick={this.goSearchScreen.emit} class="search-btn">
                {t('start_new_search')}
              </hcl-sdk-button>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
