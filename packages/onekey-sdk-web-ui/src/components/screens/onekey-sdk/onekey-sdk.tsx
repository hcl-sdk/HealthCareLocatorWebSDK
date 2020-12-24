import { Component, Host, h, Prop, Method, Element } from '@stencil/core';
import merge from 'lodash.merge';
import debounce from 'lodash.debounce';
import { applyDefaultTheme } from 'onekey-sdk-web-ui/src/utils/helper';
import ResizeObserver from 'resize-observer-polyfill';
import { configStore, uiStore } from '../../../core/stores';
import { OneKeySDKConfigData } from '../../../core/stores/ConfigStore';
import { ROUTER_PATH } from '../../onekey-sdk-router/constants';

const defaults = {
  homeMode: 'min'
}
@Component({
  tag: 'onekey-sdk',
  styleUrl: 'onekey-sdk.scss',
  shadow: true,
})
export class OneKeySDK {
  @Element() el: HTMLElement;
  @Prop() config: OneKeySDKConfigData;

  parentEl;

  @Method()
  updateConfig(patch: any) {
    configStore.setState(merge({}, this.config, patch));
    return Promise.resolve(configStore.state);
  }

  componentWillLoad() {
    applyDefaultTheme();
    configStore.setState(merge({}, defaults, this.config));
    const parent = this.el.parentElement;
    parent.style.padding = "0";
    // add a position (if not defined) to parent element in order to stretch
    // the sdk wrapper dimensions using absolute position
    if (getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }

    this.parentEl = parent;

    const update = debounce(this.updateParentDims.bind(this), 100);

    update();

    const ro = new ResizeObserver(update);

    ro.observe(parent);
  }

  updateParentDims() {
    uiStore.setParentDims(this.parentEl.getBoundingClientRect())
  }

  render() {
    const { screenSize, orientation } = uiStore.state.breakpoint;
    if (screenSize === 'unknown') {
      return null;
    }
    return (
      <Host>
        <div class={`wrapper size-${screenSize} orientation-${orientation}`}>
          <onekey-sdk-router>
            <onekey-sdk-route component="onekey-sdk-home" path={ROUTER_PATH.MAIN} />
            <onekey-sdk-route component="onekey-sdk-search-result" path={ROUTER_PATH.SEARCH_RESULT} />
            <onekey-sdk-route component="onekey-sdk-search" path={ROUTER_PATH.SEARCH} />
          </onekey-sdk-router>
          <onekey-sdk-modal modal={configStore.state.modal} />
        </div>
      </Host>
    );
  }
}
