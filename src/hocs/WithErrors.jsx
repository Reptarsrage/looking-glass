import React, { Component, Fragment } from 'react';
import { Typography } from '@material-ui/core';

const WithErrors = WrappedComponent =>
  class ErrorBoundary extends Component {
    state = {
      error: null,
      errorInfo: null,
    };

    componentDidCatch(error, errorInfo) {
      this.setState({
        error,
        errorInfo,
      });
    }

    render() {
      const { error, errorInfo } = this.state;

      return (
        <Fragment>
          {error ? (
            <Fragment>
              <Typography variant="h2">Something went wrong.</Typography>
              <Typography style={{ whiteSpace: 'pre-wrap' }}>
                {error.toString()}
                <br />
                {errorInfo.componentStack}
              </Typography>
            </Fragment>
          ) : (
            <WrappedComponent {...this.props} />
          )}
        </Fragment>
      );
    }
  };

export default WithErrors;
