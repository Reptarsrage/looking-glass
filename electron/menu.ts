// based on https://github.com/sindresorhus/electron-context-menu
import electron, { BrowserWindow } from 'electron';
import { download } from 'electron-dl';
import isDev from 'electron-is-dev';

const decorateMenuItem = (menuItem: any): any => {
  return (options: any = {}) => {
    if (options.transform && !options.click) {
      menuItem.transform = options.transform;
    }

    return menuItem;
  };
};

const removeUnusedMenuItems = (menuTemplate: any) => {
  // filter visible Items
  const visibleItems: any[] = menuTemplate.filter(
    (menuItem: any) =>
      menuItem !== undefined && menuItem !== false && menuItem.visible !== false && menuItem.visible !== ''
  );

  // remove unneeded separators
  let prevMenuItem: any = null;
  return visibleItems.filter((menuItem, index, array) => {
    const isSeparator = menuItem.type === 'separator';
    const isLast = index === array.length - 1;
    const nextItemIsSeparator = !isLast && array[index + 1].type === 'separator';
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
      let { selectionText, srcURL, linkURL } = props;
      const hasText = selectionText.trim().length > 0;
      const win = this.mainWindow;

      const defaultActions = {
        separator: () => ({ type: 'separator' }),
        cut: decorateMenuItem({
          id: 'cut',
          label: 'Cut',
          enabled: editFlags.canCut,
          visible: isEditable,
          click(menuItem: any) {
            const target = win.webContents;

            if (!menuItem.transform && target) {
              target.cut();
            } else {
              selectionText = menuItem.transform ? menuItem.transform(selectionText) : selectionText;
              electron.clipboard.writeText(selectionText);
            }
          },
        }),
        copy: decorateMenuItem({
          id: 'copy',
          label: 'Copy',
          enabled: editFlags.canCopy,
          visible: isEditable || hasText,
          click(menuItem: any) {
            const target = win.webContents;

            if (!menuItem.transform && target) {
              target.copy();
            } else {
              selectionText = menuItem.transform ? menuItem.transform(selectionText) : selectionText;
              electron.clipboard.writeText(selectionText);
            }
          },
        }),
        paste: decorateMenuItem({
          id: 'paste',
          label: 'Paste',
          enabled: editFlags.canPaste,
          visible: isEditable,
          click(menuItem: any) {
            const target = win.webContents;

            if (menuItem.transform) {
              let clipboardContent = electron.clipboard.readText('clipboard');
              clipboardContent = menuItem.transform ? menuItem.transform(clipboardContent) : clipboardContent;
              target.insertText(clipboardContent);
            } else {
              target.paste();
            }
          },
        }),
        saveImage: decorateMenuItem({
          id: 'saveImage',
          label: 'Save Image',
          visible: mediaType === 'image',
          click(menuItem: any) {
            srcURL = menuItem.transform ? menuItem.transform(srcURL) : srcURL;
            download(win, srcURL);
          },
        }),
        saveImageAs: decorateMenuItem({
          id: 'saveImageAs',
          label: 'Save Image As…',
          visible: mediaType === 'image',
          click(menuItem: any) {
            srcURL = menuItem.transform ? menuItem.transform(srcURL) : srcURL;
            download(win, srcURL, { saveAs: true });
          },
        }),
        saveVideo: decorateMenuItem({
          id: 'saveVideo',
          label: 'Save Video',
          visible: mediaType === 'video',
          click(menuItem: any) {
            srcURL = menuItem.transform ? menuItem.transform(srcURL) : srcURL;
            download(win, srcURL);
          },
        }),
        saveVideoAs: decorateMenuItem({
          id: 'saveVideoAs',
          label: 'Save Video As…',
          visible: mediaType === 'video',
          click(menuItem: any) {
            srcURL = menuItem.transform ? menuItem.transform(srcURL) : srcURL;
            download(win, srcURL, { saveAs: true });
          },
        }),
        copyLink: decorateMenuItem({
          id: 'copyLink',
          label: 'Copy Link',
          visible: linkURL.length !== 0 && mediaType === 'none',
          click(menuItem: any) {
            linkURL = menuItem.transform ? menuItem.transform(linkURL) : linkURL;

            electron.clipboard.write({
              bookmark: linkText,
              text: linkURL,
            });
          },
        }),
        saveLinkAs: decorateMenuItem({
          id: 'saveLinkAs',
          label: 'Save Link As…',
          visible: linkURL.length !== 0 && mediaType === 'none',
          click(menuItem: any) {
            linkURL = menuItem.transform ? menuItem.transform(linkURL) : linkURL;
            download(win, linkURL, { saveAs: true });
          },
        }),
        copyImage: decorateMenuItem({
          id: 'copyImage',
          label: 'Cop&y Image',
          visible: mediaType === 'image',
          click() {
            win.webContents.copyImageAt(x, y);
          },
        }),
        copyImageAddress: decorateMenuItem({
          id: 'copyImageAddress',
          label: 'C&opy Image Address',
          visible: mediaType === 'image',
          click(menuItem: any) {
            srcURL = menuItem.transform ? menuItem.transform(srcURL) : srcURL;

            electron.clipboard.write({
              bookmark: srcURL,
              text: srcURL,
            });
          },
        }),
        inspect: () => ({
          id: 'inspect',
          label: 'Inspect Element',
          click() {
            win.webContents.inspectElement(x, y);

            if (win.webContents.isDevToolsOpened()) {
              win.webContents.devToolsWebContents?.focus();
            }
          },
        }),
      };

      let menuTemplate = [
        defaultActions.separator(),
        defaultActions.cut(),
        defaultActions.copy(),
        defaultActions.paste(),
        defaultActions.separator(),
        defaultActions.saveImage(),
        defaultActions.saveImageAs(),
        defaultActions.copyImage(),
        defaultActions.copyImageAddress(),
        defaultActions.separator(),
        defaultActions.saveVideo(),
        defaultActions.saveVideoAs(),
        defaultActions.separator(),
        defaultActions.copyLink(),
        defaultActions.saveLinkAs(),
        defaultActions.separator(),
        isDev && defaultActions.inspect(),
        defaultActions.separator(),
      ];

      // filter out leading/trailing separators
      menuTemplate = removeUnusedMenuItems(menuTemplate);

      if (menuTemplate.length > 0) {
        const menu = electron.Menu.buildFromTemplate(menuTemplate);
        menu.popup({ window: win });
      }
    });
  }
}

export default MenuBuilder;
