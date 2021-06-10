import { Component, Host, h, Prop, Method } from '@stencil/core';
import cls from 'classnames';

@Component({
  tag: 'hcl-sdk-input',
  styleUrl: 'hcl-sdk-input.scss',
  shadow: false,
})
export class HclSdkInput {
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
  @Prop() type?: string = "text";
  @Prop() checked?: boolean = false;
  @Prop() onFocus?: (e: any) => void;
  @Prop() onBlur?: (e: any) => void;
  @Prop() readOnly?: boolean = false;
  @Prop() onEnterKeyDown?: (e: any) => void;
  @Prop() onArrowKeyDown?: (e: any) => void;

  textInput!: HTMLInputElement;

  componentDidLoad() {
    if (this.autoFocus && this.textInput) {
      this.textInput.focus();
    }

    this.textInput.addEventListener('keydown', (evt) => {
      if (evt.key === 'Enter') {
        evt.preventDefault()
        this.onEnterKeyDown(evt)
      } else if (evt.key === 'ArrowDown') {
        evt.preventDefault()
        this.onArrowKeyDown(evt)
      }
    })
  }

  @Method()
  focusHclSdkInput() {
    this.textInput.focus()
  }

  render() {
    const inputClass = cls('hcl-sdk-input', this.class);
    if(this.type === "checkbox" || this.type === "radio") {
      return (
        <Host class="input-checkbox">
          <input type={this.type} name={this.name} checked={this.checked} onInput={this.onInput} readOnly={this.readOnly} />
          <span class="checkmark" />
        </Host>
      )
    }

    return (
      <Host>
        <input
          type={this.type}
          class={inputClass}
          ref={el => (this.textInput = el)}
          name={this.name}
          value={this.value}
          placeholder={this.placeholder}
          onInput={this.onInput}
          autoComplete={this.autoComplete}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          readOnly={this.readOnly}
        />
        {!this.loading && this.postfixIcon && <hcl-sdk-button noBorder icon={this.postfixIcon} class="input-postfix" onClick={this.onPostfixClick} type="button" />}
        {this.loading && <hcl-sdk-icon name="circular" class="input-postfix input-postfix__loader" width={15} height={15} />}
        <slot></slot>
      </Host>
    );
  }
}
