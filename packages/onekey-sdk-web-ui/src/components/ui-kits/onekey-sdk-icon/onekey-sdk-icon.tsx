import { Component, Host, h, Prop, State } from '@stencil/core';
import cls from 'classnames'

@Component({
  tag: 'onekey-sdk-icon',
  styleUrl: 'onekey-sdk-icon.scss',
  shadow: false,
})
export class OnekeySdkIcon {
  @Prop() name: string
  @Prop() width: number;
  @Prop() height: number;
  @Prop() color: string;
  @Prop() primary: boolean = false;
  @State() iconComponent: any;

  componentWillLoad() {
    this.iconComponent = `onekey-sdk-icon-${this.name}`
  }

  render() {
    const iconClass = cls("icon", {
      primary: this.primary
    })

    return (
      <Host class={iconClass}>
        <this.iconComponent color={this.color} width={this.width} height={this.height} />
      </Host>
    );
  }
}
