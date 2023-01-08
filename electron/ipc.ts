import os from 'node:os';

import { BrowserWindow, dialog, ipcMain } from 'electron';
import type { App, Event, IpcMainInvokeEvent } from 'electron';
import invariant from 'tiny-invariant';

function handleGetVersion(app: App) {
  return app.getVersion();
}

function handleGetOs() {
  return [os.type(), os.arch(), os.release()].filter(Boolean).join(' ');
}

function handleSetTitle(event: IpcMainInvokeEvent, title?: string) {
  BrowserWindow.fromWebContents(event.sender)?.setTitle(title ?? 'The Looking Glass');
  BrowserWindow.fromWebContents(event.sender)?.webContents.send('title', title);
}

function handleSetIcon(event: IpcMainInvokeEvent, icon?: string) {
  BrowserWindow.fromWebContents(event.sender)?.webContents.send('icon', icon);
}

async function handleChooseFolder(): Promise<string | undefined> {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  if (!canceled) {
    return filePaths[0];
  }

  return undefined;
}

async function handleOauth(event: IpcMainInvokeEvent, uri: string) {
  const win = BrowserWindow.fromWebContents(event.sender);
  invariant(win, 'Could not find window for oauth');

  return new Promise((resolve, reject) => {
    const url = new URL(uri);
    const searchParams = new URLSearchParams(url.search);
    const expectedState = searchParams.get('state');
    const authWindow = new BrowserWindow({
      parent: win,
      modal: true,
      show: false,
      autoHideMenuBar: true,
    });

    function handleDidNavigate(_: Event, __: string, status: number) {
      // TODO: Temporary fix for reddit OAuth flow 302 redirect loop
      if (status === 302) {
        authWindow.webContents.reload();
      }
    }

    function handleWillNavigate(navigationEvent: Event, newUrl: string) {
      const toUrl = new URL(newUrl);
      const toSearchParams = new URLSearchParams(toUrl.search);
      const state = toSearchParams.get('state');
      const code = toSearchParams.get('code');
      const error = toSearchParams.get('error');

      if (error) {
        navigationEvent.preventDefault();
        reject(new Error(error));
      } else if (state === expectedState && code) {
        navigationEvent.preventDefault();
        authWindow.removeAllListeners('closed');
        setImmediate(() => authWindow.close());
        resolve(code);
      }
    }

    authWindow.on('closed', () => reject(new Error('Auth window was closed by user')));
    authWindow.webContents.on('will-navigate', handleWillNavigate);
    authWindow.webContents.on('will-redirect', handleWillNavigate);
    authWindow.webContents.on('did-navigate', handleDidNavigate);

    authWindow.loadURL(uri);
    authWindow.show();
    authWindow.webContents.openDevTools();
  });
}

function handleMinimize(event: IpcMainInvokeEvent) {
  BrowserWindow.fromWebContents(event.sender)?.minimize();
}

function handleMaximize(event: IpcMainInvokeEvent) {
  BrowserWindow.fromWebContents(event.sender)?.maximize();
}

function handleUnmaximize(event: IpcMainInvokeEvent) {
  BrowserWindow.fromWebContents(event.sender)?.unmaximize();
}

function handleClose(event: IpcMainInvokeEvent) {
  BrowserWindow.fromWebContents(event.sender)?.close();
}

function handleIsMaximized(event: IpcMainInvokeEvent): boolean {
  return BrowserWindow.fromWebContents(event.sender)?.isMaximized() ?? false;
}

function handleGetTitle(event: IpcMainInvokeEvent): string {
  return BrowserWindow.fromWebContents(event.sender)?.getTitle() ?? '';
}

export const SET_TITLE = 'SET_TITLE';
export const SET_ICON = 'SET_ICON';
export const GET_TITLE = 'GET_TITLE';
export const CHOOSE_FOLDER = 'CHOOSE_FOLDER';
export const OAUTH = 'OAUTH';
export const MINIMIZE = 'MINIMIZE';
export const MAXIMIZE = 'MAXIMIZE';
export const UNMAXIMIZE = 'UNMAXIMIZE';
export const CLOSE = 'CLOSE';
export const IS_MAXIMIZED = 'IS_MAXIMIZED';
export const GET_VERSION = 'GET_VERSION';
export const GET_OS = 'GET_OS';

export function init(app: App) {
  // listen for events from the renderer
  // needs to match exactly the strings configured in preload.js
  ipcMain.handle(SET_TITLE, handleSetTitle);
  ipcMain.handle(SET_ICON, handleSetIcon);
  ipcMain.handle(CHOOSE_FOLDER, handleChooseFolder);
  ipcMain.handle(OAUTH, handleOauth);
  ipcMain.handle(MINIMIZE, handleMinimize);
  ipcMain.handle(MAXIMIZE, handleMaximize);
  ipcMain.handle(UNMAXIMIZE, handleUnmaximize);
  ipcMain.handle(CLOSE, handleClose);
  ipcMain.handle(IS_MAXIMIZED, handleIsMaximized);
  ipcMain.handle(GET_TITLE, handleGetTitle);
  ipcMain.handle(GET_VERSION, () => handleGetVersion(app));
  ipcMain.handle(GET_OS, handleGetOs);
}
