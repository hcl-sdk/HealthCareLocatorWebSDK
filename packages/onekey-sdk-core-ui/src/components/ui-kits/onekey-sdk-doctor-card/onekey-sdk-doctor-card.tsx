import { Component, Host, h, Prop } from '@stencil/core';

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

  
  render() {
    return (
      <Host>
        <div class="doctor-card">
          <span class="text name">{this.name}</span>
          <span class="text gp">{this.gp}</span>
          <span class="text address">{this.address}</span>
          <span class="text distance">{this.distance}</span>
        </div>
      </Host>
    );
  }

}
