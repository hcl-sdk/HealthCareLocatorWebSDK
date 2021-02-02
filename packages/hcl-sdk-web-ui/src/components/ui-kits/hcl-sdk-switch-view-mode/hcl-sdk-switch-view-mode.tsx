import { Component, Host, h, EventEmitter, Event, Prop } from '@stencil/core';
import cls from 'classnames'
import { configStore } from 'hcl-sdk-web-ui/src/core/stores';
import { ModeViewType } from 'hcl-sdk-web-ui/src/core/stores/ConfigStore';
import { t } from '../../../utils/i18n';
@Component({
  tag: 'hcl-sdk-switch-view-mode',
  styleUrl: 'hcl-sdk-switch-view-mode.scss',
  shadow: true,
})
export class HclSdkSwitchViewMode {
  @Event() switchViewMode: EventEmitter;
  @Prop() typeOfLabel: 'full' | 'short' | 'disabled' = 'full'

  labels = {
    full: {
      list: "list_label",
      map: "map_label"
    },
    short: {
      list: "list_label",
      map: "map_label"
    },
    disabled: {
      list: '',
      map: ''
    }
  }

  onSwitch = (mode) => {
    configStore.setState({
      modeView: mode
    })
    this.switchViewMode.emit(mode);
  }

  render() {
    const listViewClass = cls("mode-item", {
      'active': configStore.state.modeView === ModeViewType.LIST
    })

    const mapViewClass = cls("mode-item", {
      'active': configStore.state.modeView === ModeViewType.MAP
    })

    return (
      <Host>
        <div class={listViewClass} onClick={() => this.onSwitch(ModeViewType.LIST)}>
          <ion-icon name="list"></ion-icon>
          {!!this.labels[this.typeOfLabel].list &&<span>{t(this.labels[this.typeOfLabel].list)}</span>}
        </div>
        <div class={mapViewClass} onClick={() => this.onSwitch(ModeViewType.MAP)}>
          <ion-icon name="map-sharp" class="mode-item__map-icon"></ion-icon>
          {!!this.labels[this.typeOfLabel].map && <span>{t(this.labels[this.typeOfLabel].map)}</span>}
        </div>
      </Host>
    );
  }

}
