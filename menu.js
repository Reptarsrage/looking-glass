const { Menu } = require('electron');
const { download } = require('electron-dl');

class MenuBuilder {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
  }

  buildContextMenu() {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { mediaType } = props;
      const win = this.mainWindow;
      let menuTpl = [];

      if (mediaType === 'image') {
        menuTpl = [
          {
            type: 'separator',
          },
          {
            id: 'save',
            label: 'Save Image',
            click() {
              download(win, props.srcURL);
            },
          },
          {
            type: 'separator',
          },
          {
            id: 'saveAs',
            label: 'Save Image As',
            click() {
              download(win, props.srcURL, { saveAs: true });
            },
          },
          {
            type: 'separator',
          },
        ];
      } else if (mediaType === 'video') {
        menuTpl = [
          {
            type: 'separator',
          },
          {
            id: 'save',
            label: 'Save Video',
            click() {
              download(win, props.srcURL);
            },
          },
          {
            type: 'separator',
          },
          {
            id: 'saveAs',
            label: 'Save Video As',
            click() {
              download(win, props.srcURL, { saveAs: true });
            },
          },
          {
            type: 'separator',
          },
        ];
      }

      Menu.buildFromTemplate(menuTpl).popup(this.mainWindow);
    });
  }
}

module.exports = MenuBuilder;
