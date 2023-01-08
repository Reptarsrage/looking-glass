// based on https://github.com/sindresorhus/electron-context-menu
import electron, { BrowserWindow, MenuItem, MenuItemConstructorOptions } from 'electron';
import { download } from 'electron-dl';
import isDev from 'electron-is-dev';

import { nonNullable } from './utils';

const removeUnusedMenuItems = (
  menuTemplate: (MenuItem | MenuItemConstructorOptions | undefined)[]
): (MenuItem | MenuItemConstructorOptions)[] => {
  // filter visible Items
  const visibleItems = menuTemplate.filter(nonNullable).filter((item) => item.visible);

  // remove unneeded separators
  let prevMenuItem: MenuItem | MenuItemConstructorOptions | undefined;
  return visibleItems.filter((menuItem, index, array) => {
    const isSeparator = menuItem.type === 'separator';
    const isLast = index === array.length - 1;
    const nextItem = !isLast && array[index + 1];
    const nextItemIsSeparator = nextItem && nextItem.type === 'separator';
    const isFirst = prevMenuItem === null;
    const toDelete = isSeparator && (isFirst || isLast || nextItemIsSeparator);
    prevMenuItem = toDelete ? prevMenuItem : menuItem;
    return !toDelete;
  });
};

class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildContextMenu() {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { editFlags, mediaType, isEditable, linkText, x, y } = props;
      const { selectionText, srcURL, linkURL } = props;
      const hasText = selectionText.trim().length > 0;
      const win = this.mainWindow;

      const separator: MenuItemConstructorOptions = { type: 'separator' };
      const cut: MenuItemConstructorOptions = {
        id: 'cut',
        label: 'Cut',
        enabled: editFlags.canCut,
        visible: isEditable,
        click() {
          const target = win.webContents;
          target.cut();
        },
      };

      const copy: MenuItemConstructorOptions = {
        id: 'copy',
        label: 'Copy',
        enabled: editFlags.canCopy,
        visible: isEditable || hasText,
        click() {
          const target = win.webContents;
          target.copy();
        },
      };

      const paste: MenuItemConstructorOptions = {
        id: 'paste',
        label: 'Paste',
        enabled: editFlags.canPaste,
        visible: isEditable,
        click() {
          const target = win.webContents;
          target.paste();
        },
      };

      const saveImage: MenuItemConstructorOptions = {
        id: 'saveImage',
        label: 'Save Image',
        visible: mediaType === 'image',
        click() {
          download(win, srcURL);
        },
      };

      const saveImageAs: MenuItemConstructorOptions = {
        id: 'saveImageAs',
        label: 'Save Image As…',
        visible: mediaType === 'image',
        click() {
          download(win, srcURL, { saveAs: true });
        },
      };

      const saveVideo: MenuItemConstructorOptions = {
        id: 'saveVideo',
        label: 'Save Video',
        visible: mediaType === 'video',
        click() {
          download(win, srcURL);
        },
      };

      const saveVideoAs: MenuItemConstructorOptions = {
        id: 'saveVideoAs',
        label: 'Save Video As…',
        visible: mediaType === 'video',
        click() {
          download(win, srcURL, { saveAs: true });
        },
      };

      const copyLink: MenuItemConstructorOptions = {
        id: 'copyLink',
        label: 'Copy Link',
        visible: linkURL.length !== 0 && mediaType === 'none',
        click() {
          electron.clipboard.write({
            bookmark: linkText,
            text: linkURL,
          });
        },
      };

      const saveLinkAs: MenuItemConstructorOptions = {
        id: 'saveLinkAs',
        label: 'Save Link As…',
        visible: linkURL.length !== 0 && mediaType === 'none',
        click() {
          download(win, linkURL, { saveAs: true });
        },
      };

      const copyImage: MenuItemConstructorOptions = {
        id: 'copyImage',
        label: 'Cop&y Image',
        visible: mediaType === 'image',
        click() {
          win.webContents.copyImageAt(x, y);
        },
      };

      const copyImageAddress: MenuItemConstructorOptions = {
        id: 'copyImageAddress',
        label: 'C&opy Image Address',
        visible: mediaType === 'image',
        click() {
          electron.clipboard.write({
            bookmark: srcURL,
            text: srcURL,
          });
        },
      };

      const inspect: MenuItemConstructorOptions = {
        id: 'inspect',
        label: 'Inspect Element',
        click() {
          win.webContents.inspectElement(x, y);

          if (win.webContents.isDevToolsOpened()) {
            win.webContents.devToolsWebContents?.focus();
          }
        },
      };

      const menuTemplate: (MenuItemConstructorOptions | MenuItem | undefined)[] = [
        separator,
        cut,
        copy,
        paste,
        separator,
        saveImage,
        saveImageAs,
        copyImage,
        copyImageAddress,
        separator,
        saveVideo,
        saveVideoAs,
        separator,
        copyLink,
        saveLinkAs,
        separator,
        isDev ? inspect : undefined,
        separator,
      ];

      // filter out leading/trailing separators
      const usedMenuItems = removeUnusedMenuItems(menuTemplate);
      if (usedMenuItems.length > 0) {
        const menu = electron.Menu.buildFromTemplate(usedMenuItems);
        menu.popup({ window: win });
      }
    });
  }
}

export default MenuBuilder;
