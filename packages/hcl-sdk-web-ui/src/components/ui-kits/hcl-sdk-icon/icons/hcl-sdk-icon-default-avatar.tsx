import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'hcl-sdk-icon-default-avatar',
  shadow: false,
})
export class HclSdkIconDefaultAvatar {
  @Prop() color: string;
  @Prop() width: number = 20;
  @Prop() height: number = 20;

  render() {
    return (
      <Host>
        <svg
          version="1.2"
          preserveAspectRatio="none"
          style={{ overflow: 'visible', opacity: "1", mixBlendMode: 'normal', width: '33px', height: '33px' }}
        >
          <g transform="translate(0, 0) rotate(0)">
            <path
              d="M28.05,9.9c0.924,0 1.65,0.7095 1.65,1.65c0,0.91127 -0.73873,1.65 -1.65,1.65c-0.9405,0 -1.65,-0.7425 -1.65,-1.65c0,-0.9405 0.7095,-1.65 1.65,-1.65zM0,0v14.85c0,4.884 3.6135,9.075 8.481,9.7515c1.023,4.9665 5.412,8.3985 10.494,8.3985c5.92325,0 10.725,-4.80175 10.725,-10.725v-6.0885c1.914,-0.693 3.3,-2.508 3.3,-4.6365c0,-2.73381 -2.21619,-4.95 -4.95,-4.95c-2.73381,0 -4.95,2.21619 -4.95,4.95c0,2.1285 1.386,3.96 3.3,4.6365v5.94c0,4.125 -3.3,7.425 -7.425,7.425c-3.3,0 -6.072,-1.9965 -7.062,-4.9665c4.587,-0.99 7.887,-5.115 7.887,-9.735v-14.85h-6.6v4.95h3.3v9.9c0,3.64508 -2.95492,6.6 -6.6,6.6c-3.64508,0 -6.6,-2.95492 -6.6,-6.6v-9.9h3.3v-4.95z"
              style={{ strokeWidth: "0", strokeLinecap: 'butt', strokeLinejoin: 'miter', fill: this.color }}
            />
          </g>
          <defs>
            <path
              id="path-1606447796553114"
              d="M28.05,9.9c0.924,0 1.65,0.7095 1.65,1.65c0,0.91127 -0.73873,1.65 -1.65,1.65c-0.9405,0 -1.65,-0.7425 -1.65,-1.65c0,-0.9405 0.7095,-1.65 1.65,-1.65zM0,0v14.85c0,4.884 3.6135,9.075 8.481,9.7515c1.023,4.9665 5.412,8.3985 10.494,8.3985c5.92325,0 10.725,-4.80175 10.725,-10.725v-6.0885c1.914,-0.693 3.3,-2.508 3.3,-4.6365c0,-2.73381 -2.21619,-4.95 -4.95,-4.95c-2.73381,0 -4.95,2.21619 -4.95,4.95c0,2.1285 1.386,3.96 3.3,4.6365v5.94c0,4.125 -3.3,7.425 -7.425,7.425c-3.3,0 -6.072,-1.9965 -7.062,-4.9665c4.587,-0.99 7.887,-5.115 7.887,-9.735v-14.85h-6.6v4.95h3.3v9.9c0,3.64508 -2.95492,6.6 -6.6,6.6c-3.64508,0 -6.6,-2.95492 -6.6,-6.6v-9.9h3.3v-4.95z"
            />
          </defs>
        </svg>
      </Host>
    );
  }
}
