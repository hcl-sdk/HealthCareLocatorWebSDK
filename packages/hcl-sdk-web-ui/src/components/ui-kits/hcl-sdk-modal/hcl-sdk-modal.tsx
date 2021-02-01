import { Component, Host, h, Prop } from '@stencil/core';
import cn from 'classnames';
import { uiStore } from 'hcl-sdk-web-ui/src/core/stores';
import { Modal } from 'hcl-sdk-web-ui/src/core/stores/ConfigStore';
import { getCssColor } from 'hcl-sdk-web-ui/src/utils/helper';

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
                width={17}
                height={17}
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
