import { Component, Host, h, State } from '@stencil/core';
import { uiStore, searchMapStore, configStore } from '../../../core/stores';
import { getTextBodyToShare } from '../../../utils/helper';
import { t } from '../../../utils/i18n';
import cls from 'classnames';

@Component({
  tag: 'hcl-sdk-share-hcp',
  styleUrl: 'hcl-sdk-share-hcp.scss',
  shadow: false,
})
export class HclSdkShareHCP {
  @State() isCopy: boolean = false;

  textAreaEl!: HTMLTextAreaElement;

  shareLink(provider: 'fb' | 'tw' | 'li' | 'em', link: string, text = '', emailBody = '') {
    switch (provider) {
      case 'fb':
        return 'https://www.facebook.com/sharer/sharer.php?u=' + link;
      case 'tw':
        return 'https://twitter.com/intent/tweet?url=' + link + (text ? '&text=' + text : '');
      case 'li':
        return 'https://www.linkedin.com/sharing/share-offsite?url=' + link ;
      case 'em':
        return `mailto:?subject=${text}&body=${emailBody}`
      default:
        return '#';
    }
  }

  handleCopy = () => {
    if (!this.textAreaEl) {
      return
    }

    this.textAreaEl.select();
    this.textAreaEl.setSelectionRange(0, 99999); /* For mobile devices */

    document.execCommand("copy");
    this.isCopy = true
  }

  render() {
    const { individualDetail } = searchMapStore.state;

    if (!individualDetail) {
      return null;
    }

    const { name } = individualDetail;
    const { appURL, appName } = configStore.state
    const config = {
      appName,
      appURL
    }
    const textToCopy = getTextBodyToShare(individualDetail, {
      newLine: '\n',
      ...config
    })
    const textToRender = getTextBodyToShare(individualDetail, {
      newLine: '<br />',
      ...config,
      isBoldFirstLine: true
    })
    const textTwitter = getTextBodyToShare(individualDetail, {
      newLine: '%0a',
      ...config
    })
    const mailBody = getTextBodyToShare(individualDetail, config);
    const subject = `Share: ${name}`;
    const linkGenerated = {
      facebook: this.shareLink('fb', appURL),
      twitter: this.shareLink('tw', appURL, textTwitter),
      linkedin: this.shareLink('li', appURL),
      email: this.shareLink('em', appURL, subject, mailBody)
    }

    return (
      <Host class={`size-${uiStore.state.breakpoint.screenSize}`}>
        <div class="share-hcp__row">
          <div class="share-hcp__col w-100">
            <div class={cls('share-hcp__text-area', {
              'copy-active': this.isCopy
            })}>
              <div innerHTML={textToRender} />
              <textarea class="copy-hidden" ref={el => (this.textAreaEl = el)}>{ textToCopy }</textarea>
              <hcl-sdk-button primary onClick={this.handleCopy}>{t('share_hcp_label_copy')}</hcl-sdk-button>
            </div>
          </div>
          {
            appURL && (
              <div class="share-hcp__col share-hcp__facebook">
                <a href={linkGenerated.facebook} target="_blank" class="share-hcp__link">
                  <hcl-sdk-icon name="facebook" width={14} height={14} color="#fff" />
                  <span class="share-hcp__text">Facebook</span>
                </a>
              </div>
            )
          }
          {
            appURL && (
              <div class="share-hcp__col share-hcp__twitter">
                <a href={linkGenerated.twitter} target="_blank" class="share-hcp__link">
                  <hcl-sdk-icon name="twitter" width={14} height={14} color="#fff" />
                  <span class="share-hcp__text">Twitter</span>
                </a>
              </div>
            )
          }
          <div class="share-hcp__col share-hcp__gmail">
            <a href={linkGenerated.email} target="_blank" class="share-hcp__link">
              <hcl-sdk-icon name="gmail" width={18} height={18} color="#fff" />
              <span class="share-hcp__text">Email</span>
            </a>
          </div>
          {
            appURL && (
              <div class="share-hcp__col share-hcp__linkedin">
                <a href={linkGenerated.linkedin} target="_blank" class="share-hcp__link">
                  <hcl-sdk-icon name="linkedin" width={14} height={14} color="#fff" />
                  <span class="share-hcp__text">LinkedIn</span>
                </a>
              </div>
            )
          }
        </div>
      </Host>
    );
  }
}
