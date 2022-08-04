const { BrowserWindow, dialog, ipcMain } = require("electron");
const os = require("os");

const log = require("./logger");

function handleGetVersion(app) {
  return app.getVersion();
}

function handleGetOs() {
  return [os.type(), os.arch(), os.release()].filter(Boolean).join(" ");
}

function handleSetTitle(event, title) {
  const win = BrowserWindow.fromWebContents(event.sender);
  win.setTitle(title ?? "The Looking Glass");
}

async function handleChooseFolder() {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ["openDirectory"] });
  if (canceled) {
    return;
  } else {
    return filePaths[0];
  }
}

async function handleOauth(event, uri) {
  const win = BrowserWindow.fromWebContents(event.sender);
  return new Promise((resolve, reject) => {
    const url = new URL(uri);
    const searchParams = new URLSearchParams(url.search);
    const expectedState = searchParams.get("state");
    const authWindow = new BrowserWindow({
      parent: win,
      modal: true,
      show: false,
      autoHideMenuBar: true,
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    });

    const handleRedirect = (uri) => {
      const url = new URL(uri);
      const searchParams = new URLSearchParams(url.search);
      const state = searchParams.get("state");
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        event.preventDefault();
        reject(new Error(error));
      } else if (state === expectedState && code) {
        event.preventDefault();
        authWindow.removeAllListeners("closed");
        setImmediate(() => authWindow.close());
        resolve(code);
      } else {
        log.info(">>>", uri);
      }
    };

    authWindow.on("closed", () => reject(new Error("Auth window was closed by user")));
    authWindow.webContents.on("will-redirect", (event, newUrl) => handleRedirect(newUrl));
    authWindow.webContents.on("will-navigate", (event, newUrl) => handleRedirect(newUrl));

    authWindow.loadURL(uri);
    authWindow.show();
  });
}

function handleMinimize(event) {
  BrowserWindow.fromWebContents(event.sender).minimize();
}

function handleMaximize(event) {
  BrowserWindow.fromWebContents(event.sender).maximize();
}

function handleUnmaximize(event) {
  BrowserWindow.fromWebContents(event.sender).unmaximize();
}

function handleClose(event) {
  BrowserWindow.fromWebContents(event.sender).close();
}

function handleIsMaximized(event) {
  return BrowserWindow.fromWebContents(event.sender).isMaximized();
}

const SET_TITLE = "SET_TITLE";
const CHOOSE_FOLDER = "CHOOSE_FOLDER";
const OAUTH = "OAUTH";
const MINIMIZE = "MINIMIZE";
const MAXIMIZE = "MAXIMIZE";
const UNMAXIMIZE = "UNMAXIMIZE";
const CLOSE = "CLOSE";
const IS_MAXIMIZED = "IS_MAXIMIZED";
const GET_VERSION = "GET_VERSION";
const GET_OS = "GET_OS";

function init(app) {
  // listen for events from the renderer
  // needs to match exactly the strings configured in preload.js
  ipcMain.handle(SET_TITLE, handleSetTitle);
  ipcMain.handle(CHOOSE_FOLDER, handleChooseFolder);
  ipcMain.handle(OAUTH, handleOauth);
  ipcMain.handle(MINIMIZE, handleMinimize);
  ipcMain.handle(MAXIMIZE, handleMaximize);
  ipcMain.handle(UNMAXIMIZE, handleUnmaximize);
  ipcMain.handle(CLOSE, handleClose);
  ipcMain.handle(IS_MAXIMIZED, handleIsMaximized);
  ipcMain.handle(GET_VERSION, () => handleGetVersion(app));
  ipcMain.handle(GET_OS, handleGetOs);
}

module.exports = {
  // init function
  init,

  // constants
  SET_TITLE,
  CHOOSE_FOLDER,
  OAUTH,
  MINIMIZE,
  MAXIMIZE,
  UNMAXIMIZE,
  CLOSE,
  IS_MAXIMIZED,
  GET_VERSION,
  GET_OS,
};
