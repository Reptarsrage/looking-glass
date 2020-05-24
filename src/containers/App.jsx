import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import { withRouter } from 'react-router';
import clsx from 'clsx';
import _ from 'lodash';

import { darkThemeSelector, moduleIdSelector, fullScreenInSelector } from '../selectors/appSelectors';
import * as appActions from '../actions/appActions';
import SearchBar from '../components/SearchBar';
import BackButton from '../components/BackButton';

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
});

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
});

const styles = (theme) => ({
  scroll: {
    overflowX: 'hidden',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      width: '10px',
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#d5d5d5',
      borderRadius: '4px',
    },
  },
  grow: {
    flexGrow: 1,
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
});

const App = ({ moduleId, children, darkTheme: useDarkTheme, classes, toggleDarkTheme, fullScreenIn }) => {
  const dispatch = (detail) => window.dispatchEvent(new CustomEvent('containerScroll', { detail }));
  const scrollCallback = _.throttle(dispatch, 200);

  const handleScroll = (event) => {
    const { scrollTop = 0 } = event.target || {};
    scrollCallback(scrollTop);
  };

  const renderBackButton = () => {
    if (!moduleId) {
      return null;
    }

    return <BackButton color="inherit" isFab={false} />;
  };

  return (
    <MuiThemeProvider theme={useDarkTheme ? darkTheme : lightTheme}>
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        className={classes.appBar}
        style={{ opacity: fullScreenIn ? '0' : '1' }}
      >
        <Toolbar>
          {renderBackButton()}
          <Typography className={classes.title} variant="h6" color="inherit" noWrap>
            Looking Glass
          </Typography>
          <SearchBar moduleId={moduleId} />
          <div className={classes.grow} />
          <div>
            <IconButton color="inherit" onClick={toggleDarkTheme}>
              {darkTheme ? <Brightness2Icon /> : <WbSunnyIcon />}
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth={false}
        id="scroll-container"
        className={clsx(classes.grow, classes.scroll)}
        onScroll={handleScroll}
      >
        {children}
      </Container>
    </MuiThemeProvider>
  );
};

App.defaultProps = {
  moduleId: null,
  fullScreenIn: false,
};

App.propTypes = {
  toggleDarkTheme: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  darkTheme: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  moduleId: PropTypes.string,
  fullScreenIn: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  darkTheme: darkThemeSelector,
  moduleId: moduleIdSelector,
  fullScreenIn: fullScreenInSelector,
});

const mapDispatchToProps = {
  toggleDarkTheme: appActions.toggleDarkTheme,
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(App);
