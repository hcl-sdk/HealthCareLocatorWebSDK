import { newSpecPage } from '@stencil/core/testing';
import { HclSdkLoading } from '../hcl-sdk-loading';

describe('hcl-sdk-loading', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [HclSdkLoading],
      html: `<hcl-sdk-loading></hcl-sdk-loading>`,
    });
    expect(page.root).toEqualHtml(`
      <hcl-sdk-loading>
        <mock:shadow-root>
        <div class="loader">Loading...</div>
        </mock:shadow-root>
      </hcl-sdk-loading>
    `);
  });
});
