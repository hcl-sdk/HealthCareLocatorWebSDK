import cls from 'classnames';
import { Component, h, Prop } from '@stencil/core';
import { OptionType } from '../../../core/types';

@Component({
  tag: 'hcl-sdk-select',
  styleUrl: 'hcl-sdk-select.scss',
  shadow: false,
})
export class HclSdkSelect {
  @Prop() options?: OptionType[];
  @Prop() loading?: boolean;
  @Prop() onChange?: (e: any) => void;
  @Prop() value?: string;
  
  render() {
    const classes = cls('hclsdk-select', {
      'hclsdk-select--loading': this.loading
    })

    return (
      <div class={classes}>
        <select onChange={this.onChange}>
          {this.options.map(item => (
            <option 
              key={item.value}
              value={item.value}
              selected={this.value == item.value}
            >{item.label}</option>
          ))}
        </select>
        <hcl-sdk-icon name="circular" width={10} height={10} color="black" />
      </div>
    );
  }
}
