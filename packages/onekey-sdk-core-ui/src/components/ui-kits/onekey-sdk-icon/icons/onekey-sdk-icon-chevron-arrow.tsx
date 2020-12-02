import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'onekey-sdk-icon-chevron-arrow',
  shadow: false,
})
export class OnekeySdkIconChevronArrow {
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
            <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" style={{ fill: this.color }} />
          </g>
        </svg>
      </Host>
    );
  }
}
