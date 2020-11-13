import { newE2EPage } from '@stencil/core/testing';

describe('onekey-sdk-loading', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<onekey-sdk-loading></onekey-sdk-loading>');

    const element = await page.find('onekey-sdk-loading');
    expect(element).toHaveClass('hydrated');
  });
});
