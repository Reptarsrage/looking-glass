// modules to control application life and create native browser window
const { app, BrowserWindow, screen } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const log = require('electron-log')
const { autoUpdater } = require('electron-updater')
const qs = require('querystring')

const MenuBuilder = require('./menu')
const createLocalWebServer = require('./localWebServer')

// web Server
let localWebServer

// auto updater
class AppUpdater {
  constructor() {
    log.transports.file.level = 'debug'
    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify()
  }
}

// dev tools installer
const installExtensions = async () => {
  // eslint-disable-next-line global-require
  const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer')
  const extensions = [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]

  return Promise.all(extensions.map(installExtension)).catch(log.error)
}

// fix warning https://github.com/electron/electron/issues/18397
app.allowRendererProcessReuse = true

// keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const createWindow = async (port) => {
  // install dev tools
  if (isDev) {
    await installExtensions()
  }

  // create the browser window.
  const { bounds } = screen.getPrimaryDisplay()
  mainWindow = new BrowserWindow({
    show: false,
    title: app.name,
    width: bounds.width,
    height: bounds.height,
    titleBarStyle: 'hidden',
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  })

  // load the url (or file)
  if (isDev) {
    mainWindow.loadURL(`http://localhost:4000?${qs.stringify({ port })}`)
  } else {
    mainWindow.loadFile(path.resolve('./dist', 'index.html'), { query: { port } })
  }

  // emitted when the window is closed.
  mainWindow.on('closed', () => {
    // dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // configure Menu
  const menuBuilder = new MenuBuilder(mainWindow)
  menuBuilder.buildContextMenu()

  // wait until window is presentable to show
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()

    // open Dev Tools
    if (isDev) {
      mainWindow.webContents.openDevTools()
    }
  })
}

// this method will be called when Electron has finished
// initialization and is ready to create browser windows.
// some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // start a web server to serve up local media files
  const { server, port } = await createLocalWebServer()
  localWebServer = server

  // create the window
  await createWindow(port)

  // remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater()
})

// quit when all windows are closed.
app.on('window-all-closed', () => {
  // on macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', async () => {
  // on macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    await createWindow()
  }
})

// in this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

app.on('before-quit', () => {
  if (localWebServer && localWebServer.listening) {
    localWebServer.close()
  }
})
