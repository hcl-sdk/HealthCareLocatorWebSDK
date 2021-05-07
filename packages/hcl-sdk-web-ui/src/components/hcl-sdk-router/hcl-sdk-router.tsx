import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'hcl-sdk-router',
  styleUrl: 'hcl-sdk-router.css',
})
export class HclSDKRouter {
  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }

}
