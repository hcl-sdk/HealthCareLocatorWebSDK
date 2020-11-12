import { newSpecPage } from '@stencil/core/testing';
import { OnekeySdkDoctorItemSwipe } from '../onekey-sdk-doctor-item-swipe';

describe('onekey-sdk-doctor-item-swipe', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [OnekeySdkDoctorItemSwipe],
      html: `<onekey-sdk-doctor-item-swipe></onekey-sdk-doctor-item-swipe>`,
    });
    expect(page.root).toEqualHtml(`
      <onekey-sdk-doctor-item-swipe>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </onekey-sdk-doctor-item-swipe>
    `);
  });
});
