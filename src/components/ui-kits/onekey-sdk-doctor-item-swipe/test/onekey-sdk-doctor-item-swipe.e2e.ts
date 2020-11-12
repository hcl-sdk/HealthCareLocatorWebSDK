import { newE2EPage } from '@stencil/core/testing';

describe('onekey-sdk-doctor-item-swipe', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<onekey-sdk-doctor-item-swipe></onekey-sdk-doctor-item-swipe>');

    const element = await page.find('onekey-sdk-doctor-item-swipe');
    expect(element).toHaveClass('hydrated');
  });
});
