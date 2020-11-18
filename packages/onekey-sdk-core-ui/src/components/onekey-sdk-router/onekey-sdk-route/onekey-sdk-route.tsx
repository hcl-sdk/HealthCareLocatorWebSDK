import { Component, Host, h, Prop } from '@stencil/core';
import { routerStore, configStore } from '../../../core/stores';

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

    const styles = configStore.state.styles
    return (
      <Host style={styles}>
        <this.component />
      </Host>
    );
  }
}