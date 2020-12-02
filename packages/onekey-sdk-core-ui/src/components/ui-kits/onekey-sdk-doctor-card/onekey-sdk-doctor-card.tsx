import { Component, Host, h, Prop } from '@stencil/core';
import cn from 'classnames';
import { getCssColor } from 'onekey-sdk-core-ui/src/utils/helper';

@Component({
  tag: 'onekey-sdk-doctor-card',
  styleUrl: 'onekey-sdk-doctor-card.scss',
  shadow: false,
})
export class OnekeySdkDoctorCard {
  // @Prop() onClick: (e: any) => void;
  @Prop() name: string;
  @Prop() gp: string;
  @Prop() address: string;
  @Prop() distance: string;
  @Prop() selected: boolean;
  @Prop() viewMode: string;
  
  render() {
    const doctorClass = cn("doctor-card", {
      selected: this.selected,
      'list-view': this.viewMode === 'LIST'
    })
    return (
      <Host>
        <div class={doctorClass}>
          <div class="doctor-card-content">
            <span class="text name">{this.name}</span>
            <span class="text gp">{this.gp}</span>
            <span class="text address">{this.address}</span>
            <span class="text distance">{this.distance}</span>
          </div>
          <onekey-sdk-icon name="chevron-arrow" color={getCssColor("--onekeysdk-color-secondary")}/>
        </div>
      </Host>
    );
  }

}
