import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { configStore } from 'onekey-sdk-core-ui/src/core/stores';
import { selectSDKElement } from 'onekey-sdk-core-ui/src/utils/helper';

@Component({
  tag: 'onekey-sdk-viewport',
  styleUrl: 'onekey-sdk-viewport.scss',
})
export class OneKeySDKViewport {
  @Event() sizeChanged: EventEmitter;

  @Prop() sizes: Object[] = [];
  sizesList;

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
  }

  componentDidLoad() {
    this.getSDKContainerValue();
  }

  getSDKContainerValue = () => {
    const onekeySDKElm = selectSDKElement();
    const containerSize = () => {
      for (let i = 0; i < this.sizesList.length; i++) {
        if (this.sizesList[i].minWidth <= onekeySDKElm.offsetWidth && onekeySDKElm.offsetWidth <= this.sizesList[i].maxWidth) {
          configStore.setState({
            viewPortSize: this.sizesList[i].name,
            viewSDKDimension: {
              width: onekeySDKElm.offsetWidth,
              height: onekeySDKElm.offsetHeight,
            },
          });
          return;
        }
      }
    };
    containerSize();

    new (window as any).ResizeObserver(containerSize).observe(onekeySDKElm);
  };

  render() {
    return (
      <Host>
        <slot></slot>
        <span class="view-port-info">
          {configStore.state.viewPortSize}: {configStore.state.viewSDKDimension?.width}px x {configStore.state.viewSDKDimension?.height}px
        </span>
      </Host>
    );
  }
}
