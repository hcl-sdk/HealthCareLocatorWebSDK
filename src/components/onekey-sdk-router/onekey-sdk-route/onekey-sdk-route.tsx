import { Component, Host, h, Prop } from '@stencil/core';
import { Store, StoreProps } from '../../onekey-sdk-store/provider';
import { RouterStore } from '../onekey-sdk-router-store/provider';

@Component({
  tag: 'onekey-sdk-route',
  styleUrl: 'onekey-sdk-route.css',
  // shadow: true,
})
export class OneKeySDKRoute {
  @Prop({ reflect: true }) component: string;
  @Prop({ reflect: true }) path: string;
  @Prop() activatedRoute: string
  @Prop() store: StoreProps

  render() {
    if(this.activatedRoute !== this.path) {
      return null
    }

    const styles = this.store.config?.styles
    return (
      <Host style={styles}>
        <this.component />
      </Host>
    );
  }
}


RouterStore.injectProps(OneKeySDKRoute, ['activatedRoute'])
Store.injectProps(OneKeySDKRoute, ['store'])