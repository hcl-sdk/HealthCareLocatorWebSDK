import { newE2EPage } from '@stencil/core/testing';

describe('onekey-sdk-switch-view-mode', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<onekey-sdk-switch-view-mode></onekey-sdk-switch-view-mode>');

    const element = await page.find('onekey-sdk-switch-view-mode');
    expect(element).toHaveClass('hydrated');
  });
});
