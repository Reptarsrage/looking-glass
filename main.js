// Modules to control application life and create native browser window
const { app, BrowserWindow, screen } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');

const MenuBuilder = require('./menu');
const createLocalWebServer = require('./localWebServer');

// Auto updater
class AppUpdater {
  constructor() {
    log.transports.file.level = 'debug';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// Dev tools installer
const installExtensions = async () => {
  // eslint-disable-next-line global-require
  const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
  const extensions = [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS];

  return Promise.all(extensions.map(installExtension)).catch(console.log);
};

// Fix warning https://github.com/electron/electron/issues/18397
app.allowRendererProcessReuse = true;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = async () => {
  // Install dev tools
  if (process.env.NODE_ENV === 'development') {
    await installExtensions();
  }

  // Create the browser window.
  const { bounds } = screen.getPrimaryDisplay();
  mainWindow = new BrowserWindow({
    show: false,
    title: app.name,
    width: bounds.width,
    height: bounds.height,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Load the url (or file)
  if (isDev) {
    mainWindow.loadURL('http://localhost:4000');
  } else {
    mainWindow.loadFile(path.resolve('./dist', 'index.html'));
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // Configure Menu
  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildContextMenu();

  // Wait until window is presentable to show
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    // Open Dev Tools
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  await createWindow();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    await createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Start a web server to serve up local media files
const server = createLocalWebServer();
app.on('before-quit', () => {
  if (server.listening) {
    server.close();
  }
});
