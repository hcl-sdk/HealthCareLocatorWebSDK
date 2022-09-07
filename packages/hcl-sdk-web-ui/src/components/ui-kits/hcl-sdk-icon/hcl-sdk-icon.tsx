import { Component, Host, h, Prop, State } from '@stencil/core';
import cls from 'classnames';
import { configStore } from '../../../core/stores';
import { IconNames } from './iconNames';

@Component({
  tag: 'hcl-sdk-icon',
  styleUrl: 'hcl-sdk-icon.scss',
  shadow: false,
})
export class HclSdkIcon {
  @Prop() name: string | IconNames;
  @Prop() width: number = 20;
  @Prop() height: number = 20;
  @Prop() color: string;
  @Prop() primary: boolean = false;
  @State() iconComponent: any;
  @State() customizedIcons = {}

  componentWillLoad() {
    this.iconComponent = `hcl-sdk-icon-${this.name}`;
  }

  componentWillUpdate() {
    this.iconComponent = `hcl-sdk-icon-${this.name}`;
  }

  render() {
    const iconClass = cls('icon', {
      primary: this.primary,
    });

    const overwroteIcon = configStore.state.icons[this.name];
    return (
      <Host class={iconClass} style={{ width: `${this.width}px`, height: `${this.height}px` }}>
        {
          overwroteIcon
          ? <span innerHTML={overwroteIcon} />
          : <this.iconComponent color={this.color} width={this.width} height={this.height} />
        }
      </Host>
    );
  }
}
