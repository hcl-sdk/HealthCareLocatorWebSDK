import { h, Element, Listen } from '@stencil/core'
import { Component, Prop } from '@stencil/core';
import { routerStore } from "../../../core/stores";

@Component({
  tag: 'hcl-sdk-router-link'
})
export class HclSDKRouterLink {
  @Element() el!: HTMLElement;

  @Prop() url: string;
  @Prop() activeClass: string = 'link-active';

  @Prop() custom: string = 'a';

  @Prop() anchorClass?: string;
  @Prop() anchorRole?: string;
  @Prop() anchorTitle?: string;
  @Prop() anchorTabIndex?: string;
  @Prop() anchorId?: string;

  @Prop() ariaHaspopup?: string;
  @Prop() ariaPosinset?: string;
  @Prop() ariaSetsize?: number;
  @Prop() ariaLabel?: string;


  @Listen('click', { capture: true })
  handleClick(e: MouseEvent) {
    e.preventDefault();
    return routerStore.push(this.url)
  }

  render() {
     const isMatch = routerStore.state.currentRoutePath === this.url;

    let anchorAttributes: { [key: string]: any} = {
      class: {
        [this.activeClass]: isMatch,
      },
      onClick: this.handleClick.bind(this)
    }

    if (this.anchorClass) {
      anchorAttributes.class[this.anchorClass] = true;
    }

    if (this.custom === 'a') {
      anchorAttributes = {
        ...anchorAttributes,
        href: this.url,
        title: this.anchorTitle,
        role: this.anchorRole,
        tabindex: this.anchorTabIndex,
        'aria-haspopup': this.ariaHaspopup,
        id: this.anchorId,
        'aria-posinset': this.ariaPosinset,
        'aria-setsize': this.ariaSetsize,
        'aria-label': this.ariaLabel
       }
    }
    return (
      <this.custom {...anchorAttributes}>
        <slot />
      </this.custom>
    );
  }
}

