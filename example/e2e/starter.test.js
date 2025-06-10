import { by, device, element, expect } from 'detox';

describe('Example', () => {
  beforeAll(async () => {
    const permissions = { camera: 'YES', microphone: 'YES' };
    await device.launchApp({ permissions });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have APIExample screen', async () => {
    await expect(element(by.text('APIExample'))).toBeVisible();
  });

  it('should show Login screen after tap', async () => {
    await element(by.text('Login')).tap();
    await expect(element(by.text('Login'))).toBeVisible();
  });

  it('should show CreateStreamChannel screen after tap', async () => {
    await element(by.text('CreateStreamChannel')).tap();
    await expect(element(by.text('CreateStreamChannel'))).toBeVisible();
  });
});
