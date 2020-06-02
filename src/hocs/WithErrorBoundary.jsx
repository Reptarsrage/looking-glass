import React, { Component } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import Typography from '@material-ui/core/Typography';
import HomeIcon from '@material-ui/icons/Home';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router';

// See https://reactjs.org/docs/error-boundaries.html
const withErrorBoundary = (WrappedComponent) => {
  class WithErrorBoundary extends Component {
    static propTypes = {
      // actions
      history: ReactRouterPropTypes.history.isRequired,
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
      const { history } = this.props;
      this.setState({ error: null, errorInfo: null });
      history.push('/');
    };

    render() {
      const { error, errorInfo } = this.state;
      const { history, ...rest } = this.props;

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
  }

  return withRouter(WithErrorBoundary);
};

export default withErrorBoundary;
