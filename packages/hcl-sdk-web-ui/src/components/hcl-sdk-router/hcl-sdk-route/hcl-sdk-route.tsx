import { Component, Host, h, Prop } from '@stencil/core';
import { routerStore } from '../../../core/stores';

@Component({
  tag: 'hcl-sdk-route',
  styleUrl: 'hcl-sdk-route.css',
})
export class HclSDKRoute {
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
