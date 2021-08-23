import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider, createTheme } from '@material-ui/core/styles'

// https://material-ui.com/customization/palette/
const darkTheme = {
  palette: {
    mode: 'dark',
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
    mode: 'light',
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

const withTheme = (WrappedComponent) => (props) => {
  const appliedTheme = createTheme(darkTheme || lightTheme)

  return (
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline />
      <WrappedComponent {...props} />
    </ThemeProvider>
  )
}

export default withTheme