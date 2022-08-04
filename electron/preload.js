const { contextBridge, ipcRenderer } = require("electron");

const { CHOOSE_FOLDER, OAUTH, MINIMIZE, MAXIMIZE, UNMAXIMIZE, CLOSE, IS_MAXIMIZED, SET_TITLE } = require("./ipc");

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
