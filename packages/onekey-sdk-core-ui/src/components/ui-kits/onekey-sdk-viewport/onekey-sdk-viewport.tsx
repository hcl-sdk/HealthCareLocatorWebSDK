import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { ViewportSize } from 'onekey-sdk-core-ui/src/components/ui-kits/onekey-sdk-viewport/types';
import { configStore } from 'onekey-sdk-core-ui/src/core/stores';
import { selectSDKElement } from 'onekey-sdk-core-ui/src/utils/helper';
import ResizeObserver from 'resize-observer-polyfill';

@Component({
  tag: 'onekey-sdk-viewport',
  styleUrl: 'onekey-sdk-viewport.scss',
})
export class OneKeySDKViewport {
  @Event() sizeChanged: EventEmitter;

  @Prop() sizes: Object[] = [];
  sizesList;
  viewPortByDevice

  componentWillLoad() {
    if (!this.sizes || this.sizes.length < 1) {
      // Default sizes, if none are provided as a Prop
      this.sizesList = [
        { name: 'xs', minWidth: 0, maxWidth: 319 },
        { name: 'sm', minWidth: 320, maxWidth: 511 },
        { name: 'md', minWidth: 512, maxWidth: 991 },
        { name: 'lg', minWidth: 992, maxWidth: 1199 },
        { name: 'xl', minWidth: 1200, maxWidth: 9999 },
      ];
    } else {
      this.sizesList = [...this.sizes];
    }

    this.viewPortByDevice = {
      'mobile': {
        viewPortSize: ViewportSize.Small,
        viewSDKDimension: {
          width: this.sizesList[1].minWidth,
          height: this.sizesList[1].maxWidth,
        }
      },
      'tablet': {
        viewPortSize: ViewportSize.Large,
        viewSDKDimension: {
          width: this.sizesList[3].maxWidth,
          height: this.sizesList[3].minWidth,
        }
      },
      'desktop': {
        viewPortSize: ViewportSize.ExtraLarge,
        viewSDKDimension: {
          width: window.innerWidth,
          height: window.innerHeight,
        }
      }
    }
  }

  componentDidLoad() {
    this.getSDKContainerValue();
    configStore.setState({
      viewPortSize: ViewportSize.Small,
      viewSDKDimension: {
        width: this.sizesList[1].minWidth,
        height: this.sizesList[1].maxWidth,
      }
    })
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

  onChange = (e) => {
    const isMobileMode = e.path[0].options.selectedIndex === 0 && this.viewPortByDevice.mobile;
    const isTabletMode = e.path[0].options.selectedIndex === 1 && this.viewPortByDevice.tablet;
    const isDesktopMode = e.path[0].options.selectedIndex === 2 && this.viewPortByDevice.desktop;

    configStore.setState(isMobileMode || isTabletMode || isDesktopMode)
  }

  render() {
    return (
      <Host>
        <slot></slot>
        <div class="view-port-info">
          <select class="view-port-selection" onChange={this.onChange} name="resView">
            <option value="mobile">Mobile</option>
            <option value="tablet">Tablet</option>
            <option value="desktop">Desktop</option>
          </select>
          <span>{configStore.state.viewPortSize}: {configStore.state.viewSDKDimension?.width}px x {configStore.state.viewSDKDimension?.height}px</span>
        </div>
      </Host>
    );
  }
}
