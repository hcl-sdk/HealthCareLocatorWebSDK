import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'onekey-sdk-icon-list',
  shadow: false,
})
export class OnekeySdkIconList {
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
            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" style={{ fill: this.color }} />
          </g>
        </svg>
      </Host>
    );
  }
}
