import { newE2EPage } from '@stencil/core/testing';

describe('onekey-sdk-doctor-card', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<onekey-sdk-doctor-card></onekey-sdk-doctor-card>');

    const element = await page.find('onekey-sdk-doctor-card');
    expect(element).toHaveClass('hydrated');
  });
});
