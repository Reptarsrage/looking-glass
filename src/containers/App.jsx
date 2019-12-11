import React, { Component } from 'react';
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
import Brightness2Icon from '@material-ui/icons/Brightness2';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import { withRouter } from 'react-router';
import ReactRouterPropTypes from 'react-router-prop-types';
import Container from '@material-ui/core/Container';

import { darkThemeSelector, moduleIdSelector } from '../selectors/appSelectors';
import * as appActions from '../actions/appActions';
import WithErrors from '../hocs/WithErrors';
import SearchBar from '../components/SearchBar';
import BackButton from '../components/BackButton';

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
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
});

class App extends Component {
  renderBackButton = () => {
    const { history, moduleId } = this.props;

    if (!moduleId) {
      return null;
    }

    return <BackButton history={history} color="inherit" isFab={false} />;
  };

  render() {
    const { children, darkTheme: useDarkTheme, classes, toggleDarkTheme, moduleId } = this.props;

    return (
      <MuiThemeProvider theme={useDarkTheme ? darkTheme : lightTheme}>
        <CssBaseline />
        <AppBar position="static" color="default" className={classes.appBar}>
          <Toolbar>
            {this.renderBackButton()}
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
        <Container maxWidth={false}>{children}</Container>
      </MuiThemeProvider>
    );
  }
}

App.defaultProps = {
  moduleId: null,
};

App.propTypes = {
  toggleDarkTheme: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  darkTheme: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  moduleId: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  darkTheme: darkThemeSelector,
  moduleId: moduleIdSelector,
});

const mapDispatchToProps = {
  toggleDarkTheme: appActions.toggleDarkTheme,
};

export default compose(withRouter, WithErrors, connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(App);
