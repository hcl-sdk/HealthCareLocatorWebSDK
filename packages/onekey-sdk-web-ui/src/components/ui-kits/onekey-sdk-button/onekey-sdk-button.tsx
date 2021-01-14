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
    const btnClass = cls('oksdk-btn', this.class, {
      'oksdk-btn--primary': this.primary,
      'oksdk-btn--secondary': this.secondary,
      'oksdk-btn--disabled': this.disabled,
      'oksdk-btn--full': this.isFull,
      'oksdk-btn--round': this.round,
      'oksdk-btn--has-icon': this.icon,
      'oksdk-btn--no-border': this.noBorder,
      'oksdk-btn--no-background': this.noBackground,
      'oksdk-btn--no-text-color': this.noTextColor,
    });

    if (this.icon) {
      return (
        <button class={btnClass} type={this.type}>
          <onekey-sdk-icon 
            name={this.icon} 
            color={this.iconColor}
            class="oksdk-btn__icon" 
            width={this.iconWidth} height={this.iconHeight} 
          />
          <slot></slot>
        </button>
      );
    }

    return (
      <button class={btnClass} type={this.type}>
        <slot></slot>
      </button>
    );
  }
}
