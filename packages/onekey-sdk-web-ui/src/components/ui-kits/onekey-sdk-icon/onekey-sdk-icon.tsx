import { Component, Host, h, Prop, State } from '@stencil/core';
import cls from 'classnames';

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

  componentWillLoad() {
    this.iconComponent = `onekey-sdk-icon-${this.name}`;
  }

  render() {
    const iconClass = cls('icon', {
      primary: this.primary,
    });

    return (
      <Host class={iconClass} style={{ width: `${this.width}px`, height: `${this.height}px` }}>
        <this.iconComponent color={this.color} width={this.width} height={this.height} />
      </Host>
    );
  }
}
