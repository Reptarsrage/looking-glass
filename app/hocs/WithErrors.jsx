import React, { Component, Fragment } from 'react';
import Typography from '@material-ui/core/Typography';
import HomeIcon from '@material-ui/icons/Home';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const WithErrors = WrappedComponent =>
  class ErrorBoundary extends Component {
    constructor() {
      super();

      this.state = {
        error: null,
        errorInfo: null,
      };

      this.handleClick = this.handleClick.bind(this);
    }

    componentDidCatch(error, errorInfo) {
      this.setState({
        error,
        errorInfo,
      });
    }

    handleClick() {
      this.setState({ error: null, errorInfo: null });
    }

    render() {
      const { error, errorInfo } = this.state;

      return (
        <Fragment>
          {error ? (
            <Fragment>
              <Typography variant="h2">Something went wrong.</Typography>
              <Button color="primary" variant="contained" onClick={this.handleClick} component={Link} to="/">
                Take me home
                <HomeIcon />
              </Button>

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
