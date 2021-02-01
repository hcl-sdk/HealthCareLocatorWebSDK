import { Component, h, Prop } from '@stencil/core';
import cls from 'classnames';
import 'ionicons';

@Component({
  tag: 'hcl-sdk-button',
  styleUrl: 'hcl-sdk-button.scss',
  shadow: false,
})
export class HclSdkButton {
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
    const btnClass = cls('hclsdk-btn', this.class, {
      'hclsdk-btn--primary': this.primary,
      'hclsdk-btn--secondary': this.secondary,
      'hclsdk-btn--disabled': this.disabled,
      'hclsdk-btn--full': this.isFull,
      'hclsdk-btn--round': this.round,
      'hclsdk-btn--has-icon': this.icon,
      'hclsdk-btn--no-border': this.noBorder,
      'hclsdk-btn--no-background': this.noBackground,
      'hclsdk-btn--no-text-color': this.noTextColor,
    });

    if (this.icon) {
      return (
        <button class={btnClass} type={this.type}>
          <hcl-sdk-icon 
            name={this.icon} 
            color={this.iconColor}
            class="hclsdk-btn__icon" 
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
