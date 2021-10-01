import React, { useState, useEffect, useCallback } from 'react'
import { getCurrentWindow } from '@electron/remote'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'

import NavButtons from './NavButtons'
import SearchBar from './SearchBar'

const useStyles = makeStyles((theme) => ({
  titleBar: {
    display: 'block',
    position: 'fixed',
    height: '64px',
    width: 'calc(100% - 2px)',
    background: theme.palette.grey[900],
    color: theme.palette.getContrastText(theme.palette.grey[900]),
    boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
  },
  dragRegion: {
    width: '100%',
    height: '100%',
    '-webkit-app-region': 'drag',
    display: 'flex',
    alignItems: 'center',
  },
  windowControls: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 46px)',
    position: 'absolute',
    top: 0,
    right: 0,
    height: '30px',
    '-webkit-app-region': 'no-drag',
  },
  button: {
    gridRow: '1 / span 1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '46px',
    height: '100%',
    userSelect: 'none',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:active': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  buttonClose: {
    '&:hover': {
      backgroundColor: 'rgba(232, 17, 35, 0.9)',
    },
    '&:active': {
      backgroundColor: 'rgba(232, 17, 35, 0.5)',
    },
  },
  iconMin: {
    gridColumn: 1,
    mask: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 4.399V5.5H0V4.399h11z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%",
  },
  iconMax: {
    gridColumn: 1,
    mask: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 0v11H0V0h11zM9.899 1.101H1.1V9.9h8.8V1.1z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%",
  },
  iconRestore: {
    gridColumn: 1,
    mask: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 8.798H8.798V11H0V2.202h2.202V0H11v8.798zm-3.298-5.5h-6.6v6.6h6.6v-6.6zM9.9 1.1H3.298v1.101h5.5v5.5h1.1v-6.6z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%",
  },
  iconClose: {
    gridColumn: 1,
    mask: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%",
  },
  icon: {
    display: 'inline-block',
    height: '100%',
    width: '100%',
    maskSize: '23.1%',
    backgroundColor: theme.palette.getContrastText(theme.palette.grey[900]),
  },
}))

export default function TitleBar() {
  const classes = useStyles()
  const win = getCurrentWindow()
  const [maximized, setMaximized] = useState(win.isMaximized())

  useEffect(() => {
    win.on('maximize', toggleMaxRestoreButtons)
    win.on('unmaximize', toggleMaxRestoreButtons)

    return () => {
      win.off('maximize', toggleMaxRestoreButtons)
      win.off('unmaximize', toggleMaxRestoreButtons)
    }
  }, [win])

  const toggleMaxRestoreButtons = useCallback(() => {
    setMaximized(win.isMaximized())
  }, [win])

  const minimize = useCallback(() => {
    win.minimize()
  }, [win])

  const maximize = useCallback(() => {
    win.maximize()
  }, [win])

  const unmaximize = useCallback(() => {
    win.unmaximize()
  }, [win])

  const close = useCallback(() => {
    win.close()
  }, [win])

  const handleKeyPress = useCallback(() => {})

  return (
    <header className={classes.titleBar}>
      <div className={classes.dragRegion}>
        <NavButtons />
        <SearchBar />
        <div className={classes.windowControls}>
          <div className={classes.button} onClick={minimize} role="button" tabIndex="0" onKeyPress={handleKeyPress}>
            <div className={clsx(classes.icon, classes.iconMin)} />
          </div>

          {!maximized && (
            <div className={classes.button} onClick={maximize} role="button" tabIndex="0" onKeyPress={handleKeyPress}>
              <div className={clsx(classes.icon, classes.iconMax)} />
            </div>
          )}

          {maximized && (
            <div className={classes.button} onClick={unmaximize} role="button" tabIndex="0" onKeyPress={handleKeyPress}>
              <div className={clsx(classes.icon, classes.iconRestore)} />
            </div>
          )}

          <div
            className={clsx(classes.button, classes.buttonClose)}
            onClick={close}
            role="button"
            tabIndex="0"
            onKeyPress={handleKeyPress}
          >
            <div className={clsx(classes.icon, classes.iconClose)} />
          </div>
        </div>
      </div>
    </header>
  )
}
