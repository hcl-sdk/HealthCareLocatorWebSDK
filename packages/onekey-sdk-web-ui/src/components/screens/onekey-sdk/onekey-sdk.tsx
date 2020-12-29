import { Component, Host, h, Prop, Method, Element } from '@stencil/core';
import merge from 'lodash.merge';
import debounce from 'lodash.debounce';
import { applyDefaultTheme } from 'onekey-sdk-web-ui/src/utils/helper';
import ResizeObserver from 'resize-observer-polyfill';
import { configStore, uiStore, searchMapStore, routerStore } from '../../../core/stores';
import { OneKeySDKConfigData } from '../../../core/stores/ConfigStore';
import { ROUTER_PATH } from '../../onekey-sdk-router/constants';
import { NEAR_ME_ITEM } from '../../../core/constants';

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

  @Method()
  searchNearMe({ specialtyCode, specialtyLabel }) {
    searchMapStore.setSearchFieldValue('address', NEAR_ME_ITEM.name);
    searchMapStore.setSearchFieldValue('name', specialtyLabel);
    searchMapStore.setState({
      locationFilter: NEAR_ME_ITEM,
      specialtyFilter: { id: specialtyCode },
    });
    routerStore.push('/search-result');
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

    // Search near me entry
    if (this.config && this.config.entry && this.config.entry.screenName === 'nearMe') {
      const { specialtyCode, specialtyLabel } = this.config.entry;
      if (!specialtyCode) {
        console.error('missing specialtyCode for "near me" search');
        return;
      }
      if (!specialtyLabel) {
        console.error('missing specialtyLabel for "near me" search');
        return;
      }
      this.searchNearMe({ specialtyCode, specialtyLabel });
    }
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
