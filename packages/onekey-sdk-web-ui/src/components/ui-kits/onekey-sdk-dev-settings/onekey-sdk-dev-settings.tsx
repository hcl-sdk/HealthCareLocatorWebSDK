import { Component, Host, h, State } from '@stencil/core';
import cls from 'classnames';

interface DevSettings {
  [k: string]: any;
}

const defaultSettings = {
  homeMode: 'min',
  screenLayout: 'desktop',
};

const storeSettings = (settings: DevSettings) => {
  localStorage.setItem(`__onekey-sdk-dev-settings`, JSON.stringify(settings));
};

const loadSettings = (): DevSettings => {
  const settingsStr = localStorage.getItem(`__onekey-sdk-dev-settings`);
  if (settingsStr) {
    return JSON.parse(settingsStr);
  }
  return defaultSettings;
};

const optionSets = [
  {
    key: 'homeMode',
    label: 'Home mode',
    options: [
      { label: 'Min', value: 'min' },
      { label: 'Full', value: 'full' },
    ],
  },
  {
    key: 'screenLayout',
    label: 'Screen Layout',
    options: [
      { label: 'Desktop', value: 'desktop' },
      { label: 'Mobile', value: 'mobile' },
      { label: 'Tablet', value: 'tablet' },
    ],
  },
];

@Component({
  tag: 'onekey-sdk-dev-settings',
  styleUrl: 'onekey-sdk-dev-settings.scss',
})
export class OneKeySDKViewport {
  @State() settings = loadSettings() || defaultSettings;
  @State() isCollapsed = false;

  componentWillLoad() {
    this.applySettings();
  }

  applySettings() {
    const oneKeySDK = document.querySelector('onekey-sdk');
    const wrapper = document.querySelector('.onekey-sdk-wrapper');
    wrapper.classList.remove(...optionSets.find(o => o.key === 'screenLayout').options.map(o => o.value))
    wrapper.classList.add(this.settings.screenLayout);
    oneKeySDK.updateConfig({ homeMode: this.settings.homeMode });
  }

  changeSetting(k, v) {
    this.settings = {
      ...this.settings,
      [k]: v,
    };
    storeSettings(this.settings);
    this.applySettings();
  }

  handleCollapseBtnClick = () => {
    this.isCollapsed = !this.isCollapsed;
  }

  renderSetting(setting) {
    return (
      <div class="setting">
        <label>{setting.label}</label>
        <select onChange={e => this.changeSetting(setting.key, (e.target as any).value)}>
          {setting.options.map(option => (
            <option value={option.value} selected={this.settings[setting.key] === option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  render() {
    const className = cls('dev-settings', {
      collapsed: this.isCollapsed
    })
    return (
      <Host>
        <slot></slot>
        <div class={className}>
          <div class="dev-settings-collapse-btn" onClick={this.handleCollapseBtnClick}>{this.isCollapsed ? '<' : '>'}</div>
          {optionSets.map(optionSet => this.renderSetting(optionSet))}
        </div>
      </Host>
    );
  }
}
