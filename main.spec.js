const { Application } = require('spectron');
const electronPath = require('electron');

const appPath = __dirname;
jest.setTimeout(10000);

describe('Application launch', () => {
  let app;

  beforeEach(async () => {
    app = new Application({
      path: electronPath,
      args: [appPath],
      env: {
        ELECTRON_IS_DEV: '0',
        NODE_ENV: 'test',
      },
    });

    await app.start();
  });

  afterEach(async () => {
    if (app && app.isRunning()) {
      await app.stop();
    }
  });

  it('shows an initial window', async () => {
    const count = await app.client.getWindowCount();
    expect(count).toBe(1);
  }, 10000);
});
