import { Application } from 'spectron';
import os from 'os';

describe('Application', () => {
  let app;

  beforeAll(() => {
    let path;
    if (os.type() === 'Linux') {
      path = './dist/linux-unpacked/electron-react-test';
    } else if (os.type() === 'Darwin') {
      path = './dist/mac/electron-react-test.app/Contents/MacOS/electron-react-test';
    } else if (os.type() === 'Windows_NT') {
      path = './dist/win-unpacked/electron-react-test.exe';
    } else {
      throw new Error(`${os.type()} not recognized.`);
    }

    app = new Application({
      path,
    });
    return app.start();
  });

  afterAll(() => {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  it('shows an initial window', async () => {
    // arrange
    app.client.waitUntilWindowLoaded();

    // act
    const count = await app.client.getWindowCount();

    // assert
    expect(count).toEqual(1);
  });

  it('contains no error logs in main process', async () => {
    // arrange
    app.client.waitUntilWindowLoaded();

    // act
    const logs = await app.client.getMainProcessLogs();
    const errors = logs.filter(log => log.level === 'error');

    // assert
    expect(errors).toEqual([]);
  });

  it('contains no error logs in renderer process', async () => {
    // arrange
    app.client.waitUntilWindowLoaded();

    // act
    const logs = await app.client.getRenderProcessLogs();
    const errors = logs.filter(log => log.level === 'error');

    // assert
    expect(errors).toEqual([]);
  });

  it('passes an accessibility audit', async () => {
    // arrange
    app.client.waitUntilWindowLoaded();

    // act
    const audit = await app.client.auditAccessibility();

    // assert
    expect(audit.failed).toBe(false);
  });
});
