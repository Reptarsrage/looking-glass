import { contextBridge, ipcRenderer } from 'electron';

const SET_TITLE = 'SET_TITLE';
const SET_ICON = 'SET_ICON';
const GET_TITLE = 'GET_TITLE';
const CHOOSE_FOLDER = 'CHOOSE_FOLDER';
const OAUTH = 'OAUTH';
const MINIMIZE = 'MINIMIZE';
const MAXIMIZE = 'MAXIMIZE';
const UNMAXIMIZE = 'UNMAXIMIZE';
const CLOSE = 'CLOSE';
const IS_MAXIMIZED = 'IS_MAXIMIZED';
const GET_VERSION = 'GET_VERSION';
const GET_OS = 'GET_OS';

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title?: string) => ipcRenderer.invoke(SET_TITLE, title),
  setIcon: (icon?: string) => ipcRenderer.invoke(SET_ICON, icon),
  chooseFolder: () => ipcRenderer.invoke(CHOOSE_FOLDER),
  oauth: (uri: string) => ipcRenderer.invoke(OAUTH, uri),
  minimize: () => ipcRenderer.invoke(MINIMIZE),
  maximize: () => ipcRenderer.invoke(MAXIMIZE),
  unmaximize: () => ipcRenderer.invoke(UNMAXIMIZE),
  close: () => ipcRenderer.invoke(CLOSE),
  isMaximized: () => ipcRenderer.invoke(IS_MAXIMIZED),
  getTitle: () => ipcRenderer.invoke(GET_TITLE),
  on: (eventName: string, callback: () => void) => {
    ipcRenderer.on(eventName, callback);
  },
  off: (eventName: string, callback: () => void) => {
    ipcRenderer.off(eventName, callback);
  },
});

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  v8: () => process.versions.v8,
  os: () => ipcRenderer.invoke(GET_OS),
  app: () => ipcRenderer.invoke(GET_VERSION),
});
