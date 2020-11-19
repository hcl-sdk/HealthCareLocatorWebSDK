import { newSpecPage } from '@stencil/core/testing';
import { OnekeySdkSwitchViewMode } from '../onekey-sdk-switch-view-mode';

describe('onekey-sdk-switch-view-mode', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [OnekeySdkSwitchViewMode],
      html: `<onekey-sdk-switch-view-mode></onekey-sdk-switch-view-mode>`,
    });
    expect(page.root).toEqualHtml(`
      <onekey-sdk-switch-view-mode>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </onekey-sdk-switch-view-mode>
    `);
  });
});
