import { Component, Host, h, Prop } from '@stencil/core';
import { configStore } from '../../../core/stores';
import { OneKeySDKConfigData } from '../../../core/stores/ConfigStore';

@Component({
  tag: 'onekey-sdk',
  styleUrl: 'onekey-sdk.scss',
  shadow: true,
})
export class OneKeySDK {
  @Prop() config: OneKeySDKConfigData;

  componentDidLoad() {
    configStore.setState(this.config)
  }

  render() {
    return (
      <Host>
        <onekey-sdk-router>
          <onekey-sdk-route component="onekey-sdk-home" path="/" />
          <onekey-sdk-route component="onekey-sdk-search-result" path="/search-result" />
          <onekey-sdk-route component="onekey-sdk-search" path="/search" />
        </onekey-sdk-router>
      </Host>
    );
  }
}
