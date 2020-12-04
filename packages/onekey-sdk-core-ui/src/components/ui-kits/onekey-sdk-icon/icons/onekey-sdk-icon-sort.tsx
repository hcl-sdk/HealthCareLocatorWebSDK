import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'onekey-sdk-icon-sort',
  shadow: false,
})
export class OnekeySdkIconSort {
  @Prop() color: string;
  @Prop() width: number = 16;
  @Prop() height: number = 10;

  render() {
    return (
      <Host>
        <svg version="1.2" preserveAspectRatio="none" style={{ opacity: '1', mixBlendMode: 'normal', width: `${this.width}px`, height: `${this.height}px` }}>
          <g transform="translate(0, 0) rotate(0)">
            <path d="M0,5.25h10v-1.5h-10zM0,0v1.5h15v-1.5zM0,9h5v-1.5h-5z" style={{ strokeWidth: "0", strokeLinecap: 'butt', strokeLinejoin: 'miter', fill: 'white' }} />
          </g>
          <defs>
            <path id="path-1607066377294140667" d="M0,5.25h10v-1.5h-10zM0,0v1.5h15v-1.5zM0,9h5v-1.5h-5z" />
          </defs>
        </svg>
      </Host>
    );
  }
}
