import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SearchIcon from '@material-ui/icons/Search';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import { withRouter } from 'react-router';
import ReactRouterPropTypes from 'react-router-prop-types';
import Container from '@material-ui/core/Container';

import { darkThemeSelector, moduleIdSelector, galleryIdSelector } from '../selectors/appSelectors';
import { searchQuerySelector } from '../selectors/gallerySelectors';
import * as appActions from '../actions/appActions';
import WithErrors from '../hocs/WithErrors';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
  typography: {
    useNextVariants: true,
  },
});

const lightTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

const styles = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(9),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(10),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
});

class App extends Component {
  handleSearchChange = e => {
    const { updateSearch, moduleId, galleryId } = this.props;

    updateSearch(e.target.value, moduleId, galleryId);
  };

  renderSearch = () => {
    const { classes, location, searchQuery } = this.props;
    const showSearch = location.pathname.startsWith('/gallery');

    if (!showSearch) {
      // TODO: render only when on gallery
      return null;
    }

    return (
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search…"
          onChange={this.handleSearchChange}
          value={searchQuery || ''}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
        />
      </div>
    );
  };

  renderBackButton = () => {
    const { classes, location, history } = this.props;
    const showBackButton = location.pathname.startsWith('/gallery');

    if (!showBackButton) {
      // TODO: render only when on gallery
      return null;
    }

    return (
      <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer" onClick={history.goBack}>
        <ArrowBackIcon />
      </IconButton>
    );
  };

  render() {
    const { children, darkTheme: useDarkTheme, classes, toggleDarkTheme } = this.props;

    return (
      <MuiThemeProvider theme={useDarkTheme ? darkTheme : lightTheme}>
        <CssBaseline />
        <AppBar position="static" color="default" className={classes.appBar}>
          <Toolbar>
            {this.renderBackButton()}
            <Typography className={classes.title} variant="h6" color="inherit" noWrap>
              Looking Glass
            </Typography>
            {this.renderSearch()}
            <div className={classes.grow} />
            <div>
              <IconButton color="inherit" onClick={toggleDarkTheme}>
                {darkTheme ? <Brightness2Icon /> : <WbSunnyIcon />}
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <Container maxWidth={false}>{children}</Container>
      </MuiThemeProvider>
    );
  }
}

App.defaultProps = {
  moduleId: null,
  galleryId: null,
  searchQuery: null,
};

App.propTypes = {
  updateSearch: PropTypes.func.isRequired,
  toggleDarkTheme: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  darkTheme: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  moduleId: PropTypes.string,
  galleryId: PropTypes.string,
  searchQuery: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  darkTheme: darkThemeSelector,
  moduleId: moduleIdSelector,
  galleryId: galleryIdSelector,
  searchQuery: searchQuerySelector,
});

const mapDispatchToProps = {
  toggleDarkTheme: appActions.toggleDarkTheme,
  updateSearch: appActions.updateSearch,
};

export default compose(
  withRouter,
  WithErrors,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(App);
