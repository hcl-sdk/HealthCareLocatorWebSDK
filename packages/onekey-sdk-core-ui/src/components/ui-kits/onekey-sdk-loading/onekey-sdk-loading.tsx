import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'onekey-sdk-loading',
  styleUrl: 'onekey-sdk-loading.scss',
  shadow: true,
})
export class OnekeySdkLoading {

  render() {
    return (
      <Host>
        <div class="loader">Loading...</div>
      </Host>
    );
  }

}
