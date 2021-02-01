import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'hcl-sdk-icon-printer',
  shadow: false,
})
export class HclSdkIconPrinter {
  @Prop() color: string;
  @Prop() width: number = 20;
  @Prop() height: number = 20;

  render() {
    return (
      <Host>
        <svg
          version="1.2"
          preserveAspectRatio="none"
          style={{ opacity: '1', mixBlendMode: 'normal', width: `${this.width}px`, height: `${this.height}px` }}
        >
          <g transform="translate(-2.220446049250313e-16, 0) rotate(0)">
            <path
              d="M7.2,2.33333h4v1.55556h-4zM4.8,4.66667v-4.66667h8.8v4.66667c1.32548,0 2.4,1.04467 2.4,2.33333v4.66667h-2.4v2.33333h-8.8v-2.33333h-0.8v-7zM6.4,1.55556v3.11111h5.6v-3.11111zM6.4,9.33333v3.11111h5.6v-3.11111zM13.6,6.22222c-0.44183,0 -0.8,0.34822 -0.8,0.77778c0,0.42955 0.35817,0.77778 0.8,0.77778c0.44183,0 0.8,-0.34822 0.8,-0.77778c0,-0.42955 -0.35817,-0.77778 -0.8,-0.77778zM1.6,4.66667h0.8c0.44183,0 0.8,0.34822 0.8,0.77778v5.44444c0,0.42955 -0.35817,0.77778 -0.8,0.77778h-0.8c-0.88366,0 -1.6,-0.69645 -1.6,-1.55556v-3.88889c0,-0.85911 0.71634,-1.55556 1.6,-1.55556z"
              style={{ strokeWidth: "0", strokeLinecap: 'butt', strokeLinejoin: 'miter', fill: this.color }}
            />
          </g>
          <defs>
            <path
              id="path-1606447796556122"
              d="M7.2,2.33333h4v1.55556h-4zM4.8,4.66667v-4.66667h8.8v4.66667c1.32548,0 2.4,1.04467 2.4,2.33333v4.66667h-2.4v2.33333h-8.8v-2.33333h-0.8v-7zM6.4,1.55556v3.11111h5.6v-3.11111zM6.4,9.33333v3.11111h5.6v-3.11111zM13.6,6.22222c-0.44183,0 -0.8,0.34822 -0.8,0.77778c0,0.42955 0.35817,0.77778 0.8,0.77778c0.44183,0 0.8,-0.34822 0.8,-0.77778c0,-0.42955 -0.35817,-0.77778 -0.8,-0.77778zM1.6,4.66667h0.8c0.44183,0 0.8,0.34822 0.8,0.77778v5.44444c0,0.42955 -0.35817,0.77778 -0.8,0.77778h-0.8c-0.88366,0 -1.6,-0.69645 -1.6,-1.55556v-3.88889c0,-0.85911 0.71634,-1.55556 1.6,-1.55556z"
            />
          </defs>
        </svg>
      </Host>
    );
  }
}