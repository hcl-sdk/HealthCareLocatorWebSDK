import { Component, Host, h } from '@stencil/core';
import cn from 'classnames';

@Component({
  tag: 'onekey-sdk-modal',
  styleUrl: 'onekey-sdk-modal.scss',
  shadow: false,
})
export class OnekeySdkModal {
  render() {
    const modalClass = cn("modal-class", { })
    return (
      <Host>
        <div class={modalClass}>
          <slot></slot>
        </div>
      </Host>
    );
  }

}
