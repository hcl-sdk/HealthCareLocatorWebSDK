import { Component, Host, h, Prop } from '@stencil/core';
import cls from 'classnames';

@Component({
  tag: 'onekey-sdk-input',
  styleUrl: 'onekey-sdk-input.scss',
  shadow: false,
})
export class OnekeySdkInput {
  @Prop() value?: any;
  @Prop() placeholder?: string;
  @Prop() onInput?: (e: any) => void;
  @Prop() onPostfixClick?: (e: any) => void;
  @Prop() name?: string;
  @Prop() autoComplete?: string;
  @Prop() postfixIcon?: string;
  @Prop() class?: string;
  @Prop() loading?: boolean = false;
  @Prop() autoFocus?: boolean = false;

  textInput!: HTMLInputElement;

  componentDidLoad() {
    if (this.autoFocus && this.textInput) {
      this.textInput.focus();
    }
  }

  render() {
    const inputClass = cls('onekey-sdk-input', this.class);
    return (
      <Host>
        <input
          class={inputClass}
          ref={el => (this.textInput = el)}
          name={this.name}
          value={this.value}
          placeholder={this.placeholder}
          onInput={this.onInput}
          autoComplete={this.autoComplete}
        />
        {!this.loading && this.postfixIcon && <onekey-sdk-button noBorder icon={this.postfixIcon} class="input-postfix" onClick={this.onPostfixClick} type="button" />}
        {this.loading && <span class="input-postfix loader" />}
        <slot></slot>
      </Host>
    );
  }
}
