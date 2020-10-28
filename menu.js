// based on https://github.com/sindresorhus/electron-context-menu
const electron = require('electron')
const { download } = require('electron-dl')
const isDev = require('electron-is-dev')

const webContents = (win) =>
  win.webContents || (win.getWebContentsId && electron.remote.webContents.fromId(win.getWebContentsId()))

const decorateMenuItem = (menuItem) => {
  return (options = {}) => {
    if (options.transform && !options.click) {
      menuItem.transform = options.transform
    }

    return menuItem
  }
}

const removeUnusedMenuItems = (menuTemplate) => {
  // Filter visible Items
  const visibleItems = menuTemplate.filter(
    (menuItem) => menuItem !== undefined && menuItem !== false && menuItem.visible !== false && menuItem.visible !== ''
  )

  // Remove unneeded separators
  let prevMenuItem = null
  return visibleItems.filter((menuItem, index, array) => {
    const isSeparator = menuItem.type === 'separator'
    const isLast = index === array.length - 1
    const nextItemIsSeparator = !isLast && array[index + 1].type === 'separator'
    const isFirst = prevMenuItem === null
    const toDelete = isSeparator && (isFirst || isLast || nextItemIsSeparator)
    prevMenuItem = toDelete ? prevMenuItem : menuItem
    return !toDelete
  })
}

class MenuBuilder {
  constructor(mainWindow) {
    this.mainWindow = mainWindow
  }

  buildContextMenu() {
    this.mainWindow.webContents.on('context-menu', (event, props) => {
      const { editFlags, mediaType, isEditable, linkText, x, y } = props
      let { selectionText, srcURL, linkURL } = props
      const hasText = selectionText.trim().length > 0
      const can = (type) => editFlags[`can${type}`] && hasText
      const win = this.mainWindow

      const defaultActions = {
        separator: () => ({ type: 'separator' }),
        cut: decorateMenuItem({
          id: 'cut',
          label: 'Cut',
          enabled: can('Cut'),
          visible: isEditable,
          click(menuItem) {
            const target = webContents(win)

            if (!menuItem.transform && target) {
              target.cut()
            } else {
              selectionText = menuItem.transform ? menuItem.transform(selectionText) : selectionText
              electron.clipboard.writeText(selectionText)
            }
          },
        }),
        copy: decorateMenuItem({
          id: 'copy',
          label: 'Copy',
          enabled: can('Copy'),
          visible: isEditable || hasText,
          click(menuItem) {
            const target = webContents(win)

            if (!menuItem.transform && target) {
              target.copy()
            } else {
              selectionText = menuItem.transform ? menuItem.transform(selectionText) : selectionText
              electron.clipboard.writeText(selectionText)
            }
          },
        }),
        paste: decorateMenuItem({
          id: 'paste',
          label: 'Paste',
          enabled: editFlags.canPaste,
          visible: isEditable,
          click(menuItem) {
            const target = webContents(win)

            if (menuItem.transform) {
              let clipboardContent = electron.clipboard.readText(selectionText)
              clipboardContent = menuItem.transform ? menuItem.transform(clipboardContent) : clipboardContent
              target.insertText(clipboardContent)
            } else {
              target.paste()
            }
          },
        }),
        saveImage: decorateMenuItem({
          id: 'saveImage',
          label: 'Save Image',
          visible: mediaType === 'image',
          click(menuItem) {
            srcURL = menuItem.transform ? menuItem.transform(srcURL) : srcURL
            download(win, srcURL)
          },
        }),
        saveImageAs: decorateMenuItem({
          id: 'saveImageAs',
          label: 'Save Image As…',
          visible: mediaType === 'image',
          click(menuItem) {
            srcURL = menuItem.transform ? menuItem.transform(srcURL) : srcURL
            download(win, srcURL, { saveAs: true })
          },
        }),
        saveVideo: decorateMenuItem({
          id: 'saveVideo',
          label: 'Save Video',
          visible: mediaType === 'video',
          click(menuItem) {
            srcURL = menuItem.transform ? menuItem.transform(srcURL) : srcURL
            download(win, srcURL)
          },
        }),
        saveVideoAs: decorateMenuItem({
          id: 'saveVideoAs',
          label: 'Save Video As…',
          visible: mediaType === 'video',
          click(menuItem) {
            srcURL = menuItem.transform ? menuItem.transform(srcURL) : srcURL
            download(win, srcURL, { saveAs: true })
          },
        }),
        copyLink: decorateMenuItem({
          id: 'copyLink',
          label: 'Copy Link',
          visible: linkURL.length !== 0 && mediaType === 'none',
          click(menuItem) {
            linkURL = menuItem.transform ? menuItem.transform(linkURL) : linkURL

            electron.clipboard.write({
              bookmark: linkText,
              text: linkURL,
            })
          },
        }),
        saveLinkAs: decorateMenuItem({
          id: 'saveLinkAs',
          label: 'Save Link As…',
          visible: linkURL.length !== 0 && mediaType === 'none',
          click(menuItem) {
            linkURL = menuItem.transform ? menuItem.transform(linkURL) : linkURL
            download(win, linkURL, { saveAs: true })
          },
        }),
        copyImage: decorateMenuItem({
          id: 'copyImage',
          label: 'Cop&y Image',
          visible: mediaType === 'image',
          click() {
            webContents(win).copyImageAt(x, y)
          },
        }),
        copyImageAddress: decorateMenuItem({
          id: 'copyImageAddress',
          label: 'C&opy Image Address',
          visible: mediaType === 'image',
          click(menuItem) {
            srcURL = menuItem.transform ? menuItem.transform(srcURL) : srcURL

            electron.clipboard.write({
              bookmark: srcURL,
              text: srcURL,
            })
          },
        }),
        inspect: () => ({
          id: 'inspect',
          label: 'Inspect Element',
          click() {
            win.inspectElement(x, y)

            if (webContents(win).isDevToolsOpened()) {
              webContents(win).devToolsWebContents.focus()
            }
          },
        }),
      }

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
      ]

      // Filter out leading/trailing separators
      menuTemplate = removeUnusedMenuItems(menuTemplate)

      if (menuTemplate.length > 0) {
        const menu = (electron.remote ? electron.remote.Menu : electron.Menu).buildFromTemplate(menuTemplate)
        menu.popup(electron.remote ? electron.remote.getCurrentWindow() : win)
      }
    })
  }
}

module.exports = MenuBuilder
