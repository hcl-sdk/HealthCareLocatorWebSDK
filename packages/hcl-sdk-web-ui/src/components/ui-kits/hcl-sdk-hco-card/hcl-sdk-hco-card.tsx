import { Component, Host, h, Prop } from '@stencil/core';
import cn from 'classnames';
import { getCssColor } from '../../../utils/helper';

@Component({
  tag: 'hcl-sdk-hco-card',
  styleUrl: 'hcl-sdk-hco-card.scss',
  shadow: false,
})
export class HclSdkHcoCard {
  @Prop() name: string;
  @Prop() department: string = 'Hospital';
  @Prop() address: string = '2 Rue Ambroise Paré, 75010 Paris';
  @Prop() distance: string = '82m';
  @Prop() showDistance: boolean = true;
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
            <div class="header">
              <span class="text name">{this.name}</span>
            </div>
            <span class="text gp">{this.department}</span>
            <span class="text address">{this.address}</span>
            {this.showDistance && <span class="text distance">{this.distance}</span>}
          </div>
          <hcl-sdk-icon name="arrow_right" color={getCssColor('--hcl-color-secondary')} />
        </div>
      </Host>
    );
  }
}
