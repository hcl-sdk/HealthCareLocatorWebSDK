import { Component, Host, h, Prop } from '@stencil/core';
import cn from 'classnames';

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
  
  render() {
    const doctorClass = cn("doctor-card", {
      selected: this.selected
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
          <ion-icon class="doctor-card-arrow-icon" name="chevron-forward-outline"></ion-icon>
        </div>
      </Host>
    );
  }

}
