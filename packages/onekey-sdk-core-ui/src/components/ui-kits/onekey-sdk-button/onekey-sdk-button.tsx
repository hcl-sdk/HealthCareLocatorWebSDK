import { Component, h, Prop } from '@stencil/core';
import cls from 'classnames';
import 'ionicons';

@Component({
  tag: 'onekey-sdk-button',
  styleUrl: 'onekey-sdk-button.scss',
  shadow: false,
})
export class OnekeySdkButton {
  @Prop() primary: boolean;
  @Prop() secondary: boolean;
  @Prop() disabled: boolean;
  @Prop() isFull: boolean;
  @Prop() round: boolean;
  @Prop() noBorder: boolean;
  @Prop() noBackground: boolean;
  @Prop() noTextColor: boolean;
  @Prop() icon: string;
  @Prop() iconColor: string;
  @Prop() class: string;
  @Prop() type: string;
  @Prop() iconWidth: number;
  @Prop() iconHeight: number;

  render() {
    const btnClass = cls('btn', this.class, {
      'primary': this.primary,
      'secondary': this.secondary,
      'disabled': this.disabled,
      'full': this.isFull,
      'round': this.round,
      'icon': this.icon,
      'no-border': this.noBorder,
      'no-background': this.noBackground,
      'no-text-color': this.noTextColor,
    });

    if (this.icon) {
      return (
        <button class={btnClass} type={this.type}>
          <onekey-sdk-icon color={this.iconColor} name={this.icon} class="btn-icon" width={this.iconWidth} height={this.iconHeight} />
          <slot></slot>
        </button>
      );
    }

    return (
      <button class={btnClass}>
        <slot></slot>
      </button>
    );
  }
}
