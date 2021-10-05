import { Component, Host, h, Prop } from '@stencil/core';
import cn from 'classnames';
import { getCssColor } from '../../../utils/helper';

@Component({
  tag: 'hcl-sdk-doctor-card',
  styleUrl: 'hcl-sdk-doctor-card.scss',
  shadow: false,
})
export class HclSdkDoctorCard {

  @Prop() name: string;
  @Prop() specialtyPrimary: string;
  @Prop() address: string;
  @Prop() distance: string;
  @Prop() selected: boolean;
  @Prop() viewMode: string;
  @Prop() showDistance: boolean = true;

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
            <span class="text gp">{this.specialtyPrimary}</span>
            <span class="text address">{this.address}</span>
            { this.showDistance && <span class="text distance">{this.distance}</span> }
          </div>
          <hcl-sdk-icon name="arrow_right" color={getCssColor("--hcl-color-secondary")}/>
        </div>
      </Host>
    );
  }

}
