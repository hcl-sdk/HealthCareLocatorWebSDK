import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { ViewportSize } from 'onekey-sdk-web-ui/src/components/ui-kits/onekey-sdk-viewport/types';
import { configStore } from 'onekey-sdk-web-ui/src/core/stores';
import { selectSDKElement } from 'onekey-sdk-web-ui/src/utils/helper';
import ResizeObserver from 'resize-observer-polyfill';

@Component({
  tag: 'onekey-sdk-viewport',
  styleUrl: 'onekey-sdk-viewport.scss',
})
export class OneKeySDKViewport {
  @Event() sizeChanged: EventEmitter;

  @Prop() sizes: Object[] = [];
  sizesList;
  viewPortByDevice;

  componentWillLoad() {
    if (!this.sizes || this.sizes.length < 1) {
      // Default sizes, if none are provided as a Prop
      this.sizesList = [
        { name: 'xs', minWidth: 0, maxWidth: 319 },
        { name: 'sm', minWidth: 360, maxWidth: 620 },
        { name: 'md', minWidth: 512, maxWidth: 991 },
        { name: 'lg', minWidth: 992, maxWidth: 1199 },
        { name: 'xl', minWidth: 1200, maxWidth: 9999 },
      ];
    } else {
      this.sizesList = [...this.sizes];
    }

    this.viewPortByDevice = {
      mobile: {
        viewPortSize: ViewportSize.Small,
        viewSDKDimension: {
          width: this.sizesList[1].minWidth,
          height: this.sizesList[1].maxWidth,
        },
      },
      tablet: {
        viewPortSize: ViewportSize.Large,
        viewSDKDimension: {
          width: this.sizesList[3].maxWidth,
          height: this.sizesList[3].minWidth,
        },
      },
      desktop: {
        viewPortSize: ViewportSize.ExtraLarge,
        viewSDKDimension: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      },
    };
  }

  componentDidLoad() {
    this.getSDKContainerValue();
    configStore.setState({
      viewPortSize: ViewportSize.Small,
      viewSDKDimension: {
        width: this.sizesList[1].minWidth,
        height: this.sizesList[1].maxWidth,
      },
    });
  }

  getSDKContainerValue = () => {
    const onekeySDKElm = selectSDKElement();
    const containerSize = () => {
      for (let i = 0; i < this.sizesList.length; i++) {
        if (this.sizesList[i].minWidth <= onekeySDKElm.offsetWidth && onekeySDKElm.offsetWidth <= this.sizesList[i].maxWidth) {
          // configStore.setState({
          //   viewPortSize: this.sizesList[i].name,
          //   viewSDKDimension: {
          //     width: onekeySDKElm.offsetWidth,
          //     height: onekeySDKElm.offsetHeight,
          //   },
          // });
          return;
        }
      }
    };
    containerSize();

    new ResizeObserver(containerSize).observe(onekeySDKElm);
  };

  onChangeViewPort = e => {
    const isMobileMode = e.path[0].options.selectedIndex === 0 && this.viewPortByDevice.mobile;
    const isTabletMode = e.path[0].options.selectedIndex === 1 && this.viewPortByDevice.tablet;
    const isDesktopMode = e.path[0].options.selectedIndex === 2 && this.viewPortByDevice.desktop;

    configStore.setState(isMobileMode || isTabletMode || isDesktopMode);
  };

  onChange = e => {
    const oneKeySDK = document.querySelector('onekey-sdk');
    if (e.target.value === 'min') {
      oneKeySDK.updateConfig({ homeMode: 'min' });
      localStorage.setItem('__onekey-sdk-dev-homeMode', 'min');
    } else if (e.target.value === 'full') {
      oneKeySDK.updateConfig({ homeMode: 'full' });
      localStorage.setItem('__onekey-sdk-dev-homeMode', 'full');
    }
  };

  isSelectedHomeMode = homeMode => {
    const stored = localStorage.getItem('__onekey-sdk-dev-homeMode');
    if (!stored) {
      return homeMode === 'min';
    }
    return homeMode === stored;
  };

  render() {
    return (
      <Host>
        <slot></slot>
        <div class="view-port-info">
          <select class="home-selection" onChange={this.onChange}>
            <option value="min" selected={this.isSelectedHomeMode('min')}>
              Home: Min
            </option>
            <option value="full" selected={this.isSelectedHomeMode('full')}>
              Home: Full
            </option>
          </select>
          <select class="view-port-selection" onChange={this.onChangeViewPort} name="resView">
            <option value="mobile">Viewport: Mobile</option>
            <option value="tablet">Viewport: Tablet</option>
            <option value="desktop">Viewport: Desktop</option>
          </select>
          <span>
            {configStore.state.viewPortSize}: {configStore.state.viewSDKDimension?.width}px x {configStore.state.viewSDKDimension?.height}px
          </span>
        </div>
      </Host>
    );
  }
}
