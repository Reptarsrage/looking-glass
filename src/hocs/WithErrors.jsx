import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import HomeIcon from '@material-ui/icons/Home';
import Button from '@material-ui/core/Button';

import * as navigationActions from '../actions/navigationActions';

const WithErrors = (WrappedComponent) =>
  class ErrorBoundary extends Component {
    static propTypes = {
      // actions
      navigateHome: PropTypes.func.isRequired,
    };

    constructor() {
      super();

      this.state = {
        error: null,
        errorInfo: null,
      };
    }

    componentDidCatch(error, errorInfo) {
      this.setState({
        error,
        errorInfo,
      });
    }

    handleClick = () => {
      const { navigateHome } = this.props;
      this.setState({ error: null, errorInfo: null });
      navigateHome();
    };

    render() {
      const { error, errorInfo } = this.state;
      const { navigateHome, ...rest } = this.props;

      return (
        <>
          {error ? (
            <>
              <Typography variant="h2">Something went wrong.</Typography>
              <Button color="primary" variant="contained" onClick={this.handleClick}>
                Take me home
                <HomeIcon />
              </Button>

              <Typography style={{ whiteSpace: 'pre-wrap' }}>
                {error.toString()}
                <br />
                {errorInfo.componentStack}
              </Typography>
            </>
          ) : (
            <WrappedComponent {...rest} />
          )}
        </>
      );
    }
  };

const mapDispatchToProps = {
  navigateHome: navigationActions.navigateHome,
};

export default compose(connect(null, mapDispatchToProps), WithErrors);
