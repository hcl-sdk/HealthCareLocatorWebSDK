import { Component, Host, h, Prop } from '@stencil/core';
import cn from 'classnames';
import { uiStore } from '../../../core/stores';
import { Modal } from '../../../core/stores/ConfigStore';
import { getCssColor } from '../../../utils/helper';

@Component({
  tag: 'hcl-sdk-modal',
  styleUrl: 'hcl-sdk-modal.scss',
  shadow: false,
})
export class HclSdkModal {
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
      <Host class={`size-${uiStore.state.breakpoint.screenSize}`}>
        <div class={cn("modal-container", this.modal.className)}>
          <div class={modalClass}>
            <div class="modal-title">
              {this.modal.title && <span class="title">{this.modal.title}</span>}
              <hcl-sdk-icon
                name="remove"
                onClick={this.onClose}
                color={getCssColor("--hcl-color-grey_dark")}
                width={20}
                height={20}
              />
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
