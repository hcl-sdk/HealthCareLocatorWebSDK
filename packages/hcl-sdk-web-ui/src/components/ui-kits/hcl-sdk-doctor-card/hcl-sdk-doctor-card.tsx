import { Component, Host, h, Prop } from '@stencil/core';
import cn from 'classnames';
import { featureStore } from '../../../core/stores';
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
  @Prop() reviewsAvailable: boolean;
  @Prop() diseasesAvailable: boolean;
  @Prop() url: string

  render() {
    const doctorClass = cn("doctor-card", {
      selected: this.selected,
      'list-view': this.viewMode === 'LIST'
    })
    const isShowLogo = this.reviewsAvailable || this.diseasesAvailable
    return (
      <Host>
        <div class={doctorClass}>
          <div class="doctor-card-content">
            <div class="header">
              <span class="text name">
                {this.name}&nbsp;&nbsp; {featureStore.isPatientRecommendationEnabled && isShowLogo && <img src="https://www.mapatho.com/favicon.ico" alt="" />}
              </span>
              {this.url && (
                <a
                  href={this.url}
                  target="_blank"
                  onClick={e => e.stopPropagation()}
                >
                  <hcl-sdk-button
                    round
                    icon="calendar-clock-outline"
                    noBackground
                    noBorder
                  />
                </a>
              )}
            </div>

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
