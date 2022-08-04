const { contextBridge, ipcRenderer } = require("electron");

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

contextBridge.exposeInMainWorld("electronAPI", {
  setTitle: (title) => ipcRenderer.invoke(SET_TITLE, title),
  chooseFolder: () => ipcRenderer.invoke(CHOOSE_FOLDER),
  oauth: (uri) => ipcRenderer.invoke(OAUTH, uri),
  minimize: () => ipcRenderer.invoke(MINIMIZE),
  maximize: () => ipcRenderer.invoke(MAXIMIZE),
  unmaximize: () => ipcRenderer.invoke(UNMAXIMIZE),
  close: () => ipcRenderer.invoke(CLOSE),
  isMaximized: () => ipcRenderer.invoke(IS_MAXIMIZED),
  on: (eventName, callback) => {
    ipcRenderer.on(eventName, callback);
  },
  off: (eventName, callback) => {
    ipcRenderer.off(eventName, callback);
  },
});

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  v8: () => process.versions.v8,
  os: () => ipcRenderer.invoke(GET_OS),
  app: () => ipcRenderer.invoke(GET_VERSION),
});
