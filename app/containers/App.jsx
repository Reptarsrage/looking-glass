import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import CssBaseline from '@material-ui/core/CssBaseline';

import WithErrors from '../hocs/WithErrors';

class App extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        {children}
      </React.Fragment>
    );
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired
};

export default compose(WithErrors)(App);
