import type { Server } from 'http';
import path from 'path';

import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import { autoUpdater } from 'electron-updater';

import * as ipc from './ipc';
import createLocalWebServer from './localWebServer';
import log from './logger';
import MenuBuilder from './menu';

// auto-update logging
autoUpdater.logger = log;

// web Server
let localWebServer: Server;
let localWebServerPort: number;

// main window
let mainWindow: BrowserWindow | null;

// dev tools installer
const installExtensions = async () => {
  const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS,
  } = await import('electron-devtools-installer');
  const extensions = [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS];
  return Promise.all(extensions.map((extension) => installExtension(extension))).catch(log.error);
};

const createWindow = async (port: number) => {
  // install dev tools
  if (isDev) {
    await installExtensions();
  }

  // create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    title: app.name,
    titleBarStyle: 'hidden',
    icon: path.resolve(__dirname, '..', 'assets', 'icon.png'),
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // load the url (or file)
  if (isDev) {
    const devPort = process.env['PORT'] || 3000;
    mainWindow.loadURL(`http://localhost:${devPort}?${new URLSearchParams([['port', port.toString()]]).toString()}`);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist_renderer/index.html'), { query: { port: port.toString() } });
  }

  // emitted when the window is closed.
  mainWindow.on('closed', () => {
    // dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // configure Menu
  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildContextMenu();

  mainWindow.on('maximize', () => {
    mainWindow?.webContents.send('maximize');
  });

  mainWindow.on('unmaximize', () => {
    mainWindow?.webContents.send('unmaximize');
  });

  // wait until window is presentable to show
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    mainWindow?.maximize();

    // open Dev Tools
    if (isDev) {
      mainWindow?.webContents.openDevTools();
    }
  });
};

// helper to send status updates to main window
function sendStatusToWindow(text?: string) {
  mainWindow?.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow(`Update available. ${info}`);
});

autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow(`Update not available. ${info}`);
});

autoUpdater.on('error', (err) => {
  sendStatusToWindow(`Error in auto-updater. ${err}`);
});

autoUpdater.on('download-progress', (progressObj) => {
  let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
  logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`;
  logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;
  sendStatusToWindow(logMessage);
});

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow(`Update downloaded. ${info}`);
});

// this method will be called when Electron has finished
// initialization and is ready to create browser windows.
// some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // start a web server to serve up local media files
  const { server, port } = await createLocalWebServer();
  localWebServer = server;
  localWebServerPort = port;

  // create the window
  await createWindow(localWebServerPort);

  // initialize IPC channels
  ipc.init(app);

  // check for updates
  autoUpdater.checkForUpdatesAndNotify();
});

// quit when all windows are closed.
app.on('window-all-closed', () => {
  // on macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  // on macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    await createWindow(localWebServerPort);
  }
});

// in this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
app.on('before-quit', () => {
  if (localWebServer && localWebServer.listening) {
    localWebServer.close();
  }
});
