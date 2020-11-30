import { Component, Host, h, Prop } from '@stencil/core';
import { ViewportSize } from 'onekey-sdk-core-ui/src/components/ui-kits/onekey-sdk-viewport/types';
import { initAppCSSWidthHeight } from 'onekey-sdk-core-ui/src/utils/helper';
import { configStore } from '../../../core/stores';
import { OneKeySDKConfigData } from '../../../core/stores/ConfigStore';

@Component({
  tag: 'onekey-sdk',
  styleUrl: 'onekey-sdk.scss',
  shadow: true
})
export class OneKeySDK {
  @Prop() config: OneKeySDKConfigData;

  componentWillLoad() {
    configStore.setState(this.config)
  }

  componentDidLoad() {
    initAppCSSWidthHeight()
  }

  render() {
    return (
      <Host>
        <onekey-sdk-viewport sizes={[
          { name: ViewportSize.ExtraSmall, minWidth: 0, maxWidth: 319 },
          { name: ViewportSize.Small, minWidth: 320, maxWidth: 511 },
          { name: ViewportSize.Medium, minWidth: 512, maxWidth: 991 },
          { name: ViewportSize.Large, minWidth: 992, maxWidth: 1199 },
          { name: ViewportSize.ExtraLarge, minWidth: 1200, maxWidth: 9999 }
        ]}>
        <onekey-sdk-router>
          <onekey-sdk-route component="onekey-sdk-home" path="/" />
          <onekey-sdk-route component="onekey-sdk-hcp-full-card" path="/hcp-full-card" />
          <onekey-sdk-route component="onekey-sdk-search-result" path="/search-result" />
          <onekey-sdk-route component="onekey-sdk-search" path="/search" />
        </onekey-sdk-router>
        </onekey-sdk-viewport>
      </Host>
    );
  }
}
