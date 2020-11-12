import { newSpecPage } from '@stencil/core/testing';
import { OnekeySdkDoctorCard } from '../onekey-sdk-doctor-card';

describe('onekey-sdk-doctor-card', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [OnekeySdkDoctorCard],
      html: `<onekey-sdk-doctor-card></onekey-sdk-doctor-card>`,
    });
    expect(page.root).toEqualHtml(`
      <onekey-sdk-doctor-card>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </onekey-sdk-doctor-card>
    `);
  });
});
