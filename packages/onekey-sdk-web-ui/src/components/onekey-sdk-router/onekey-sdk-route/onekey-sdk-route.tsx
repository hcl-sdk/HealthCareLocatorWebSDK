import { Component, Host, h, Prop } from '@stencil/core';
import { routerStore } from '../../../core/stores';

@Component({
  tag: 'onekey-sdk-route',
  styleUrl: 'onekey-sdk-route.css',
  // shadow: true,
})
export class OneKeySDKRoute {
  @Prop({ reflect: true }) component: string;
  @Prop({ reflect: true }) path: string;

  render() {
    if(routerStore.state.currentRoutePath !== this.path) {
      return null
    }

    return (
      <Host>
        <this.component class={this.component} />
      </Host>
    );
  }
}
