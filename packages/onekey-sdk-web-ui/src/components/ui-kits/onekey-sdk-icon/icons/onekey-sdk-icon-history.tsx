import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'onekey-sdk-icon-history',
  shadow: false,
})
export class OnekeySdkIconHistory {
  @Prop() color: string;
  @Prop() width: number = 20;
  @Prop() height: number = 20;

  render() {
    return (
      <Host>
        <svg
          version="1.2"
          preserveAspectRatio="none"
          viewBox="0 0 24 24"
          style={{ opacity: '1', mixBlendMode: 'normal', width: `${this.width}px`, height: `${this.height}px` }}
        >
          <g>
            <path
              d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
              // style={{ fill: 'rgb(67, 176, 42)' }}
            />
            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" style={{ fill: this.color }} />
          </g>
        </svg>
      </Host>
    );
  }
}
