import React from 'react'
import PropTypes from 'prop-types'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core'
import { createMuiTheme, makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

import Progress from 'components/Progress'
import TitleBar from 'components/TitleBar'

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
    background: {
      default: '#202020',
      paper: '#333333',
    },
    grey: {
      900: '#191919',
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
    marginTop: '72px',
  },
  grow: {
    flexGrow: '1',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 3,
    transition: theme.transitions.create('opacity'),
    position: 'fixed',
    top: 0,
    left: 0,
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
  const appliedTheme = createMuiTheme(darkTheme || lightTheme)

  return (
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline />
      <TitleBar />
      <Progress />
      <Container maxWidth={false} className={classes.container}>
        {children}
      </Container>
    </ThemeProvider>
  )
}

App.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
}
