import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import WithErrors from '../hocs/WithErrors';
import { darkThemeSelector } from '../selectors/appSelectors';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const lightTheme = createMuiTheme();

class App extends React.Component {
  render() {
    const { children, darkTheme: useDarkTheme } = this.props;
    return (
      <MuiThemeProvider theme={useDarkTheme ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  darkTheme: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  darkTheme: darkThemeSelector(),
});

export default compose(
  WithErrors,
  connect(mapStateToProps)
)(App);
