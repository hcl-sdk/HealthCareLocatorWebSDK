import { Component, Host, h, Prop, State } from '@stencil/core';
import cls from 'classnames';
import { configStore } from '../../../core/stores';

@Component({
  tag: 'onekey-sdk-icon',
  styleUrl: 'onekey-sdk-icon.scss',
  shadow: false,
})
export class OnekeySdkIcon {
  @Prop() name: string;
  @Prop() width: number = 20;
  @Prop() height: number = 20;
  @Prop() color: string;
  @Prop() primary: boolean = false;
  @State() iconComponent: any;
  @State() customizedIcons = {}

  componentWillLoad() {
    this.iconComponent = `onekey-sdk-icon-${this.name}`;
    
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
