import { newSpecPage } from '@stencil/core/testing';
import { OnekeySdkLoading } from '../onekey-sdk-loading';

describe('onekey-sdk-loading', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [OnekeySdkLoading],
      html: `<onekey-sdk-loading></onekey-sdk-loading>`,
    });
    expect(page.root).toEqualHtml(`
      <onekey-sdk-loading>
        <mock:shadow-root>
        <div class="loader">Loading...</div>
        </mock:shadow-root>
      </onekey-sdk-loading>
    `);
  });
});
