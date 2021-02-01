import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'hcl-sdk-icon-map',
  shadow: false,
})
export class HclSdkIconMap {
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
          <g transform="translate(1.1102230246251565e-16, 0) rotate(0)">
            <path
              d="M12.39583,0l-0.11333,0.02125l-3.7825,1.46625l-4.25,-1.4875l-3.995,1.34583c-0.14875,0.04958 -0.255,0.17708 -0.255,0.34v10.71c0,0.19833 0.15583,0.35417 0.35417,0.35417l0.11333,-0.02125l3.7825,-1.46625l4.25,1.4875l3.995,-1.34583c0.14875,-0.04958 0.255,-0.17708 0.255,-0.34v-10.71c0,-0.19833 -0.15583,-0.35417 -0.35417,-0.35417zM8.5,11.33333l-4.25,-1.49458v-8.42208l4.25,1.49458z"
              style={{ strokeWidth: "0", strokeLinecap: 'butt', strokeLinejoin: 'miter', fill: this.color }}
            />
          </g>
          <defs>
            <path
              id="path-160644779648214"
              d="M12.39583,0l-0.11333,0.02125l-3.7825,1.46625l-4.25,-1.4875l-3.995,1.34583c-0.14875,0.04958 -0.255,0.17708 -0.255,0.34v10.71c0,0.19833 0.15583,0.35417 0.35417,0.35417l0.11333,-0.02125l3.7825,-1.46625l4.25,1.4875l3.995,-1.34583c0.14875,-0.04958 0.255,-0.17708 0.255,-0.34v-10.71c0,-0.19833 -0.15583,-0.35417 -0.35417,-0.35417zM8.5,11.33333l-4.25,-1.49458v-8.42208l4.25,1.49458z"
            />
          </defs>
        </svg>
      </Host>
    );
  }
}
