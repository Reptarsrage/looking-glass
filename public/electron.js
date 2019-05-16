const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

class AppUpdater {
  constructor() {
    log.transports.file.level = 'debug';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

const installExtensions = async () => {
  // see https://github.com/MarshallOfSound/electron-devtools-installer
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(extensions.map(name => installer.default(installer[name], forceDownload))).catch(console.log);
};

let mainWindow;

if (isDev) {
  // additional options: https://github.com/sindresorhus/electron-debug
  require('electron-debug')({ devToolsMode: 'right' });
}

async function createWindow() {
  if (isDev) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
    },
    show: false,
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => (mainWindow = null));
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    new AppUpdater();
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  if (mainWindow === null) {
    await createWindow();
  }
});

module.exports = AppUpdater;
