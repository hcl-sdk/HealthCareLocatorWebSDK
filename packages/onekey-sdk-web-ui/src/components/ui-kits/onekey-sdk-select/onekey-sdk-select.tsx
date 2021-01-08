import cls from 'classnames';
import { Component, h, Prop } from '@stencil/core';
import { OptionType } from '../../../core/types';

@Component({
  tag: 'onekey-sdk-select',
  styleUrl: 'onekey-sdk-select.scss',
  shadow: false,
})
export class OnekeySdkSelect {
  @Prop() options?: OptionType[];
  @Prop() loading?: boolean;
  @Prop() onChange?: (e: any) => void;
  @Prop() value?: string;
  
  render() {
    const classes = cls('oksdk-select', {
      'oksdk-select--loading': this.loading
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
        <onekey-sdk-icon name="circular" width={10} height={10} color="black" />
      </div>
    );
  }
}
