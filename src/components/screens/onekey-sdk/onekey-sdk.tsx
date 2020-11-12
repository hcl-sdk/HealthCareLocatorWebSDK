import { Component, Host, h, Prop } from '@stencil/core';
import { OneKeySDKConfigData } from '../../onekey-sdk-store/provider';

@Component({
  tag: 'onekey-sdk',
  styleUrl: 'onekey-sdk.scss',
  shadow: true,
})
export class OneKeySDK {
  @Prop() config: OneKeySDKConfigData;

  render() {
    return (
      <Host>
        <onekey-sdk-global-store store={{ config: this.config }}>
          <onekey-sdk-router>
            <onekey-sdk-route component="onekey-sdk-home" path="/" />
            <onekey-sdk-route component="onekey-sdk-search-result" path="/search-result" />
            <onekey-sdk-route component="onekey-sdk-search" path="/search" />
          </onekey-sdk-router>
        </onekey-sdk-global-store>
      </Host>
    );
  }
}
