import { h, Element, Watch, Listen } from '@stencil/core'
import { Component, Prop } from '@stencil/core';
import { RouterStore } from '../onekey-sdk-router-store/provider';


@Component({
  tag: 'onekey-sdk-router-link'
})
export class OneKeySDKRouterLink {
  @Prop() activatedRoute: string = '/';
  @Prop() setActivatedRoute: Function;
  @Element() el!: HTMLElement;

  @Prop() match: boolean;
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


  @Watch('activatedRoute')
  computeMatch() {
    if (this.activatedRoute) {
      this.match = this.activatedRoute === this.url;
    }
  }

  @Listen('click', { capture: true })
  handleClick(e: MouseEvent) {
    e.preventDefault();
    console.log("this.url", this.url)
    return this.setActivatedRoute(this.url)
  }


  render() {
    let anchorAttributes: { [key: string]: any} = {
      class: {
        [this.activeClass]: this.match,
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


RouterStore.injectProps(OneKeySDKRouterLink, ['setActivatedRoute', 'activatedRoute'])

