import { Component, Host, h, EventEmitter, Event, Prop } from '@stencil/core';
import cls from 'classnames'
import { configStore } from '../../../core/stores';
import { ModeViewType } from '../../../core/stores/ConfigStore';
import { t } from '../../../utils/i18n';
@Component({
  tag: 'hcl-sdk-switch-view-mode',
  styleUrl: 'hcl-sdk-switch-view-mode.scss',
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
        <div class="hclsdk-switch-view-mode">
          <div class={listViewClass} onClick={() => this.onSwitch(ModeViewType.LIST)}>
            <hcl-sdk-icon name="list" />
            {!!this.labels[this.typeOfLabel].list &&<span>{t(this.labels[this.typeOfLabel].list)}</span>}
          </div>
          <div class={mapViewClass} onClick={() => this.onSwitch(ModeViewType.MAP)}>
            <hcl-sdk-icon name="map" width={13} height={13} />
            {!!this.labels[this.typeOfLabel].map && <span>{t(this.labels[this.typeOfLabel].map)}</span>}
          </div>
        </div>
      </Host>
    );
  }

}
