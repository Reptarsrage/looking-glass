import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core'
import { createMuiTheme, makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { useRouteMatch } from 'react-router-dom'
import { Color } from 'custom-electron-titlebar'
import Brightness3Icon from '@material-ui/icons/Brightness3'
import Brightness7Icon from '@material-ui/icons/Brightness7'

import { modalOpenSelector } from 'selectors/modalSelectors'
import BackButton from 'components/BackButton'
import Progress from 'components/Progress'
import titleBar from '../titleBar'

// https://material-ui.com/customization/palette/
const darkTheme = {
  palette: {
    type: 'dark',
    primary: {
      light: '#a6d4fa',
      main: '#90caf9',
      dark: '#648dae',
    },
    secondary: {
      light: '#f6a5c0',
      main: '#f48fb1',
      dark: '#aa647b',
    },
  },
  typography: {
    useNextVariants: true,
  },
}

const lightTheme = {
  palette: {
    type: 'light',
    primary: {
      light: '#4791db',
      main: '#1976d2',
      dark: '#115293',
    },
    secondary: {
      light: '#e33371',
      main: '#dc004e',
      dark: '#9a0036',
    },
  },
  typography: {
    useNextVariants: true,
  },
}

const useStyles = makeStyles((theme) => ({
  container: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  grow: {
    flexGrow: '1',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 3,
    transition: theme.transitions.create('opacity'),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
}))

export default function App({ children }) {
  const classes = useStyles()
  const modalOpen = useSelector(modalOpenSelector)
  const match = useRouteMatch({ path: '/', exact: true })
  const [darkThemeEnabled, toggleDarkTheme] = useState(true)
  const appliedTheme = createMuiTheme(darkThemeEnabled ? darkTheme : lightTheme)

  useEffect(() => {
    titleBar.updateBackground(Color.fromHex(appliedTheme.palette.background.default))
  }, [appliedTheme])

  const handleClick = () => {
    toggleDarkTheme(!darkThemeEnabled)
  }

  return (
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline />

      <Progress />

      <AppBar position="static" color="default" className={classes.appBar} style={{ opacity: modalOpen ? '0' : '1' }}>
        <Toolbar>
          {match ? null : <BackButton color="inherit" isFab={false} />}
          <Typography className={classes.title} variant="h6" color="inherit" noWrap>
            Looking Glass
          </Typography>
          <div className={classes.grow} />
          <div>
            <IconButton color="inherit" onClick={handleClick}>
              {darkThemeEnabled ? <Brightness3Icon /> : <Brightness7Icon />}
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} className={classes.container}>
        {children}
      </Container>
    </ThemeProvider>
  )
}

App.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
}
