import { Component, Host, h, Prop } from '@stencil/core';
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
        <onekey-sdk-router>
          <onekey-sdk-route component="onekey-sdk-home" path="/" />
          <onekey-sdk-route component="onekey-sdk-hcp-full-card" path="/hcp-full-card" />
          <onekey-sdk-route component="onekey-sdk-search-result" path="/search-result" />
          <onekey-sdk-route component="onekey-sdk-search" path="/search" />
        </onekey-sdk-router>
      </Host>
    );
  }
}
