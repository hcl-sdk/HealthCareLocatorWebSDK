import { Component, Host, h, Prop } from '@stencil/core';
import cn from 'classnames';
import { uiStore } from 'onekey-sdk-web-ui/src/core/stores';
import { Modal } from 'onekey-sdk-web-ui/src/core/stores/ConfigStore';
import { getCssColor } from 'onekey-sdk-web-ui/src/utils/helper';

@Component({
  tag: 'onekey-sdk-modal',
  styleUrl: 'onekey-sdk-modal.scss',
  shadow: false,
})
export class OnekeySdkModal {
  @Prop() modal?: Modal;

  onClose = () => {
    this.modal = undefined
  }

  render() {
    if(!this.modal) {
      return null;
    }

    const modalClass = cn("modal-class", {})
    return (
      <Host class={`size-${uiStore.state.breakpoint}`}>
        <div class="modal-container">
          <div class={modalClass}>
            <div class="modal-title">
              <span class="title">Sort</span>
              <onekey-sdk-icon name="remove" color={getCssColor("--onekeysdk-color-grey_dark")} onClick={this.onClose}/>
            </div>
            <div class="modal-content">
              <this.modal.component />
            </div>
          </div>
        </div>
      </Host>
    );
  }

}
