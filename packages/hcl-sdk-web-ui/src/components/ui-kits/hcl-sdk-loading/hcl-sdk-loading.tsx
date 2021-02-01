import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'hcl-sdk-loading',
  styleUrl: 'hcl-sdk-loading.scss',
  shadow: true,
})
export class HclSdkLoading {

  render() {
    return (
      <Host>
        <div class="loader">Loading...</div>
      </Host>
    );
  }

}
