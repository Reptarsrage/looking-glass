import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Brightness2Icon from '@material-ui/icons/Brightness2'
import WbSunnyIcon from '@material-ui/icons/WbSunny'
import { useMatch } from '@reach/router'
import { Color } from 'custom-electron-titlebar'

import { darkThemeSelector } from '../selectors/appSelectors'
import { modalOpenSelector } from '../selectors/modalSelectors'
import * as appActions from '../actions/appActions'
import BackButton from '../components/BackButton'
import Progress from '../components/Progress'
import titleBar from '../titleBar'

// https://material-ui.com/customization/palette/
const darkTheme = createMuiTheme({
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
})

const lightTheme = createMuiTheme({
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
})

const styles = (theme) => ({
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
})

const App = ({ children, useDarkTheme, classes, toggleDarkTheme, modalOpen }) => {
  const match = useMatch('/')

  useEffect(() => {
    const theme = useDarkTheme ? darkTheme : lightTheme
    console.log('updateBackground', theme.palette.background.default)
    titleBar.updateBackground(Color.fromHex(theme.palette.background.default))
  }, [useDarkTheme])

  return (
    <MuiThemeProvider theme={useDarkTheme ? darkTheme : lightTheme}>
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
            <IconButton color="inherit" onClick={toggleDarkTheme}>
              {darkTheme ? <Brightness2Icon /> : <WbSunnyIcon />}
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} className={classes.container}>
        {children}
      </Container>
    </MuiThemeProvider>
  )
}

App.defaultProps = {
  modalOpen: false,
}

App.propTypes = {
  toggleDarkTheme: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  useDarkTheme: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  modalOpen: PropTypes.bool,
}

const mapStateToProps = createStructuredSelector({
  useDarkTheme: darkThemeSelector,
  modalOpen: modalOpenSelector,
})

const mapDispatchToProps = {
  toggleDarkTheme: appActions.toggleDarkTheme,
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(App)
