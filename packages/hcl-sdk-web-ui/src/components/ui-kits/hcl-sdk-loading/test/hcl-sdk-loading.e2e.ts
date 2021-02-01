import { newE2EPage } from '@stencil/core/testing';

describe('hcl-sdk-loading', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<hcl-sdk-loading></hcl-sdk-loading>');

    const element = await page.find('hcl-sdk-loading');
    expect(element).toHaveClass('hydrated');
  });
});
