import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'onekey-sdk-icon-location',
  shadow: false,
})
export class OnekeySdkIconLocation {
  @Prop() color: string;
  @Prop() width: number = 13;
  @Prop() height: number = 20;

  render() {
    return (
      <Host>
        <svg
          version="1.2"
          preserveAspectRatio="none"
          data-id="b1669e86ed8b487fb31698a3748b9d66"
          style={{ opacity: '1', mixBlendMode: 'normal', width: `${this.width}px`, height: `${this.height}px` }}
        >
          <g transform="translate(0, 0) rotate(0)">
            <path
              d="M6.5,4.5c1.28209,0 2.32143,1.11929 2.32143,2.5c0,1.38071 -1.03934,2.5 -2.32143,2.5c-1.28209,0 -2.32143,-1.11929 -2.32143,-2.5c0,-1.38071 1.03934,-2.5 2.32143,-2.5zM6.5,0c3.58985,0 6.5,3.13401 6.5,7c0,5.25 -6.5,13 -6.5,13c0,0 -6.5,-7.75 -6.5,-13c0,-3.86599 2.91015,-7 6.5,-7zM6.5,2c-2.56418,0 -4.64286,2.23858 -4.64286,5c0,1 0,3 4.64286,9.71c4.64286,-6.71 4.64286,-8.71 4.64286,-9.71c0,-2.76142 -2.07868,-5 -4.64286,-5z"
              style={{ strokeWidth: "0", strokeLinecap: 'butt', strokeLinejoin: 'miter', fill: this.color }}
            />
          </g>
          <defs>
            <path
              id="path-1606447796577144"
              d="M6.5,4.5c1.28209,0 2.32143,1.11929 2.32143,2.5c0,1.38071 -1.03934,2.5 -2.32143,2.5c-1.28209,0 -2.32143,-1.11929 -2.32143,-2.5c0,-1.38071 1.03934,-2.5 2.32143,-2.5zM6.5,0c3.58985,0 6.5,3.13401 6.5,7c0,5.25 -6.5,13 -6.5,13c0,0 -6.5,-7.75 -6.5,-13c0,-3.86599 2.91015,-7 6.5,-7zM6.5,2c-2.56418,0 -4.64286,2.23858 -4.64286,5c0,1 0,3 4.64286,9.71c4.64286,-6.71 4.64286,-8.71 4.64286,-9.71c0,-2.76142 -2.07868,-5 -4.64286,-5z"
            />
          </defs>
        </svg>
      </Host>
    );
  }
}
