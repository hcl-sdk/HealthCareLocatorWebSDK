import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'hcl-sdk-icon-dislike',
  shadow: false,
})
export class HclSdkIconDislike {
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
              d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"
              style={{ fill: this.color }}
            />
          </g>
        </svg>
      </Host>
    );
  }
}
